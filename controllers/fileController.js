const File = require("../models/fileModel");
const s3 = require("../config/s3");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../logger"); // Import Winston logger
const statsdClient = require("../metrics"); // Import StatsD client

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Upload File API
const uploadFile = async (req, res) => {
    statsdClient.increment("api.uploadFile.call"); // Count API Calls
    const startTime = Date.now(); // Start timer for API latency

    if (!req.file) {
        logger.warn("File upload attempt without a file.");
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
        logger.info(`Uploading file: ${file.originalname} to S3 as ${fileKey}`);
        const s3StartTime = Date.now();
        await s3.upload(params).promise();
        statsdClient.timing("aws.s3.upload.time", Date.now() - s3StartTime); // S3 upload time

        const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;

        // Save file metadata using Sequelize ORM
        const dbStartTime = Date.now();
        const savedFile = await File.create({
            file_name: file.originalname,
            url: fileUrl,
        });
        statsdClient.timing("db.insert.time", Date.now() - dbStartTime); // DB insert time

        logger.info(`File uploaded successfully: ${fileUrl}`);
        res.status(201).json({
            id: savedFile.id,
            file_name: savedFile.file_name,
            url: savedFile.url,
            upload_date: savedFile.upload_date,
        });

        statsdClient.timing("api.uploadFile.time", Date.now() - startTime); // API execution time
    } catch (error) {
        logger.error("File Upload Error:", { error: error.message });
        res.status(500).json({ error: "File upload failed", details: error.message });
    }
};

// Get File API
const getFile = async (req, res) => {
    statsdClient.increment("api.getFile.call"); // Count API Calls
    const startTime = Date.now();

    const { id } = req.params;

    try {
        logger.info(`Fetching file metadata for ID: ${id}`);
        const dbStartTime = Date.now();
        const file = await File.findOne({
            where: { id },
            attributes: ["id", "file_name", "url", "upload_date"], // Select only required fields
        });
        statsdClient.timing("db.query.time", Date.now() - dbStartTime); // DB query time

        if (!file) {
            logger.warn(`File not found with ID: ${id}`);
            return res.status(404).json({ error: "File not found" });
        }

        logger.info(`File metadata retrieved successfully for ID: ${id}`);
        res.json({
            id: file.id,
            file_name: file.file_name,
            url: file.url,
            upload_date: file.upload_date,
        });

        statsdClient.timing("api.getFile.time", Date.now() - startTime);
    } catch (error) {
        logger.error("Get File Error:", { error: error.message });
        res.status(500).json({ error: "Failed to retrieve file metadata" });
    }
};

// Delete File API
const deleteFileController = async (req, res) => {
    statsdClient.increment("api.deleteFile.call");
    const startTime = Date.now();

    const { id } = req.body;

    try {
        logger.info(`Attempting to delete file with ID: ${id}`);
        const dbStartTime = Date.now();
        const file = await File.findOne({ where: { id } });
        statsdClient.timing("db.query.time", Date.now() - dbStartTime); // DB query time

        if (!file) {
            logger.warn(`File not found for deletion with ID: ${id}`);
            return res.status(404).json({ error: "File not found" });
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: file.url.split("/").pop(),
        };

        const s3StartTime = Date.now();
        await s3.deleteObject(params).promise();
        statsdClient.timing("aws.s3.delete.time", Date.now() - s3StartTime); // S3 delete time

        const dbDeleteTime = Date.now();
        await file.destroy();
        statsdClient.timing("db.delete.time", Date.now() - dbDeleteTime); // DB delete time

        logger.info(`File deleted successfully: ${file.url}`);
        res.status(204).send();

        statsdClient.timing("api.deleteFile.time", Date.now() - startTime);
    } catch (error) {
        logger.error("Delete File Error:", { error: error.message });
        res.status(500).json({ error: "File deletion failed", details: error.message });
    }
};

module.exports = { uploadFile, getFile, deleteFileController };
