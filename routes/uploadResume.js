const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const path = require("path");

const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

router.post("/resume", upload.single("resume"), async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Only allow PDF
  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF files allowed" });
  }

  const filename = `${uuidv4()}.pdf`;
  const filepath = path.join(__dirname, "../public/resume", filename);

  try {
    await pipeline(file.stream, fs.createWriteStream(filepath));
    res.status(200).json({
      message: "Resume uploaded successfully",
      url: /host/resume/${filename},
    });
  } catch (err) {
    res.status(500).json({ message: "Error while uploading", error: err.message });
  }
});

module.exports = router;
