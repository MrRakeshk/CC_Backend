const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

// ✅ 1. Configure Cloudinary (make sure .env values are loaded properly)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ 2. Setup Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "resumes",
    resource_type: "raw", // ⚠️ Must be "raw" for non-image files
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    format: "pdf",
  }),
});

// ✅ 3. Multer Middleware Setup
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// ✅ 4. Resume Upload API
router.post("/resume", upload.single("resume"), async (req, res) => {
  const userId = req.body.userId;

  if (!req.file) {
    console.error("No file received");
    return res.status(400).json({ message: "No resume file received" });
  }

  const fileUrl = req.file.path; // ✅ Always returns the full Cloudinary URL

  try {
    const applicant = await ApplicantSchema.findOne({ userId });

    if (!applicant) {
      console.error("Applicant not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    applicant.resume = fileUrl;
    await applicant.save();

    console.log("Resume uploaded successfully:", fileUrl);
    return res.status(200).json({ message: "Upload successful", fileUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

