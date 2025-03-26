const express = require("express");
const multer = require("multer");
const { uploadFile, getFile, deleteFile } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.head("/", (req, res) => {
    res.status(405).json({ error: "Method Not Allowed", message: "HEAD requests are not supported on this endpoint." });
});

router.head("/:id", (req, res) => {
    res.status(405).json({ error: "Method Not Allowed", message: "HEAD requests are not supported on this endpoint." });
});


router.post("/", upload.single("file"), uploadFile);
router.get("/:id", getFile);
router.delete("/:id", deleteFile);


// Return 400 Bad Request for GET and DELETE on /v1/file (only valid for file/{id})
router.get('/', (req, res) => {
    res.status(400).json({ error: "Bad Request", message: "GET /v1/file is not a valid request. Use GET /v1/file/{id} instead." });
});

router.delete('/', (req, res) => {
    res.status(400).json({ error: "Bad Request", message: "DELETE /v1/file is not a valid request. Use DELETE /v1/file/{id} instead." });
});

// Handle unsupported methods for `/v1/file`
router.all("/", (req, res) => {
    res.status(405).json({ error: "Method Not Allowed" });
});

// Handle unsupported methods for `/v1/file/{file_name}`
router.all("/:id", (req, res) => {
    res.status(405).json({ error: "Method Not Allowed" });
});


module.exports = router;
