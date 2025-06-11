const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "resumes" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

router.post("/resume", upload.single("resume"), async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF files allowed" });
  }

  try {
    const result = await uploadToCloudinary(file.buffer);
    res.status(200).json({
      message: "Resume uploaded successfully",
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading to Cloudinary", error: err.message });
  }
});

module.exports = router;
