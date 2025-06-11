const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const path = require("path");
const User = require("../model/User"); 

const pipeline = promisify(require("stream").pipeline);
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

router.post("/resume", upload.single("resume"), async (req, res) => {
  const { file } = req;
  const { userId } = req.body;

  if (!file || !userId) {
    return res.status(400).json({ message: "Resume file or user ID missing" });
  }

  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF files allowed" });
  }

  const filename = `${uuidv4()}.pdf`;
  const filepath = path.join(__dirname, "../public/resume", filename);
  const resumeUrl = `/host/resume/${filename}`;

  try {
    await pipeline(file.stream, fs.createWriteStream(filepath));

    // ✅ Update the resume URL in the user's MongoDB document
    await User.findByIdAndUpdate(userId, { resume: resumeUrl });

    res.status(200).json({
      message: "Resume uploaded successfully",
      url: resumeUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Error while uploading", error: err.message });
  }
});

module.exports = router;
