const express = require("express");
const mongoose = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

// Download resume by applicant ID
router.get("/resume/:applicantId", async (req, res) => {
  try {
    const applicant = await ApplicantSchema.findById(req.params.applicantId);

    if (!applicant || !applicant.resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Force download
    const downloadUrl = applicant.resumeUrl.includes("cloudinary")
      ? applicant.resumeUrl + "?fl_attachment=true"
      : applicant.resumeUrl;

    return res.redirect(downloadUrl);
  } catch (err) {
    console.error("Resume download error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
