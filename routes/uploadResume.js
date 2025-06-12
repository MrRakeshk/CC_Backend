const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const router = express.Router();

// ✅ Setup multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB max file size
});

// ✅ Handle CORS preflight request for /resume
router.options("/resume", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://cc-frontend-dusky.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // No content
});

// ✅ Actual resume upload handler
router.post("/resume", upload.single("resume"), async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Only allow PDF files
  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF files allowed" });
  }

  const filename = `${uuidv4()}.pdf`;
  const filepath = path.join(__dirname, "../public/resume", filename);

  try {
    // Write the file to disk
    await fs.promises.writeFile(filepath, file.buffer);

    // Send back success response with the file URL
    res.status(200).json({
      message: "Resume uploaded successfully",
      url: `/host/resume/${filename}`,
    });
  } catch (err) {
    console.error("❌ File write error:", err);
    res.status(500).json({
      message: "Error while uploading",
      error: err.message,
    });
  }
});

module.exports = router;
