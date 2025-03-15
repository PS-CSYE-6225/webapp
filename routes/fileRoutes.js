const express = require("express");
const multer = require("multer");
const { uploadFile, getFile, deleteFileController } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/v1/file", upload.single("file"), uploadFile);
router.get("/v1/file/:file_name", getFile);
router.delete("/v1/file", deleteFileController);

module.exports = router;
