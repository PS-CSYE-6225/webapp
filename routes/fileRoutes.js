const express = require("express");
const multer = require("multer");
const { uploadFile, getFile, deleteFileController } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadFile);
router.get("/:file_name", getFile);
router.delete("/", deleteFileController);


module.exports = router;
