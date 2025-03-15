const s3 = require("../config/s3");
const { saveFile, getFileByName, deleteFile } = require("../models/fileModel");
const { v4: uuidv4 } = require("uuid");

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.file;
  const fileKey = `${uuidv4()}-${file.originalname}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.upload(params).promise();
    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;

    await saveFile(file.originalname, fileUrl);

    res.status(201).json({
      file_name: file.originalname,
      url: fileUrl,
      upload_date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("File Upload Error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

const getFile = async (req, res) => {
  const { file_name } = req.params;

  try {
    const file = await getFileByName(file_name);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("Get File Error:", error);
    res.status(500).json({ error: "Failed to retrieve file metadata" });
  }
};

const deleteFileController = async (req, res) => {
  const { file_name } = req.body;

  try {
    const file = await getFileByName(file_name);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: file.url.split("/").pop(),
    };

    await s3.deleteObject(params).promise();
    await deleteFile(file_name);

    res.status(204).send();
  } catch (error) {
    console.error("Delete File Error:", error);
    res.status(500).json({ error: "File deletion failed" });
  }
};

module.exports = { uploadFile, getFile, deleteFileController };
