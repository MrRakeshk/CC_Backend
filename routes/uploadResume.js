const multer = require("multer");
const express = require("express");
const path = require("path");
const { default: mongoose } = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // get original extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/resume", upload.single("resume"), async (req, res) => {
  const fileName = req.file.filename;
  const id = req.body.userId;

  try {
    const applicant = await ApplicantSchema.findOne({ userId: id });
    if (!applicant) {
      return res.status(404).json({ message: "User does not exist" });
    }

    applicant.resume = fileName;
    await applicant.save();

    console.log("Uploaded file:", fileName);

    res.status(200).json({ message: "Upload successful", fileName });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
