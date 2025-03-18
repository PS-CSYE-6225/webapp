const File = require("../models/fileModel");
const s3 = require("../config/s3");
const { v4: uuidv4 } = require("uuid");

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Upload File API
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

        // Save file metadata using Sequelize ORM
        const savedFile = await File.create({
            file_name: file.originalname,
            url: fileUrl,
        });

        res.status(201).json({
            id: savedFile.id,
            file_name: savedFile.file_name,
            url: savedFile.url,
            upload_date: savedFile.upload_date,
        });
    } catch (error) {
        console.error("File Upload Error:", error);
        res.status(500).json({ error: "File upload failed", details: error.message });
    }
};

const getFile = async (req, res) => {
  const { file_name } = req.params;

  try {
      // Fetch only file_name and url from DB
      const file = await File.findOne({
          where: { file_name },
          attributes: ["file_name", "url"]  // Select only required fields
      });

      if (!file) {
          return res.status(404).json({ error: "File not found" });
      }

      // Send response with only required metadata
      res.json({
          file_name: file.file_name,
          url: file.url
      });

  } catch (error) {
      console.error("Get File Error:", error);
      res.status(500).json({ error: "Failed to retrieve file metadata" });
  }
};

// Delete File API
const deleteFileController = async (req, res) => {
    const { file_name } = req.body;

    try {
        const file = await File.findOne({ where: { file_name } });
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: file.url.split("/").pop(),
        };

        await s3.deleteObject(params).promise();
        await file.destroy();

        res.status(204).send();
    } catch (error) {
        console.error("Delete File Error:", error);
        res.status(500).json({ error: "File deletion failed", details: error.message });
    }
};

module.exports = { uploadFile, getFile, deleteFileController };
