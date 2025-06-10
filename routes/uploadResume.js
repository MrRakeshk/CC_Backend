const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes",             
    resource_type: "raw",             
    format: async (req, file) => "pdf", 
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

// 📥 Multer Setup
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/resume", upload.single("resume"), async (req, res) => {
  const id = req.body.userId;
  const fileUrl = req.file.path; // Cloudinary file URL

  try {
    const applicant = await ApplicantSchema.findOne({ userId: id });

    if (!applicant) {
      return res.status(404).json({ message: "User does not exist" });
    }

    applicant.resume = fileUrl; // Save URL to MongoDB
    await applicant.save();

    console.log("Uploaded to Cloudinary:", fileUrl);
    res.status(200).json({ message: "Upload successful", fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
