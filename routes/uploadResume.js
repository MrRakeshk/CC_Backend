const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

// 🌩️ Cloudinary Configuration from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📦 Setup Cloudinary Storage for PDF uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "resumes",
      resource_type: "raw", // required for non-image files like PDFs
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      format: "pdf", // explicitly set PDF format
    };
  },
});

// 🎯 Set up Multer middleware
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

// 📤 Resume Upload Endpoint
router.post("/resume", upload.single("resume"), async (req, res) => {
  const id = req.body.userId;

  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "Resume file upload failed" });
  }

  const fileUrl = req.file.path; // ✅ full Cloudinary URL

  try {
    const applicant = await ApplicantSchema.findOne({ userId: id });

    if (!applicant) {
      return res.status(404).json({ message: "User does not exist" });
    }

    applicant.resume = fileUrl;
    await applicant.save();

    console.log("Uploaded to Cloudinary:", fileUrl);
    res.status(200).json({ message: "Upload successful", fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
