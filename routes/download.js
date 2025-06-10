const express = require("express");
const mongoose = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

// Replace with your actual Cloudinary cloud name
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dvy6xbobi/raw/upload/resumes/";

router.get("/resume/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid applicant ID" });
  }

  try {
    const applicant = await ApplicantSchema.findById(id);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const resumeFileName = applicant.resume;

    if (!resumeFileName) {
      return res.status(404).json({ message: "Resume not uploaded yet" });
    }

    const fullResumeUrl = `${CLOUDINARY_BASE_URL}${resumeFileName}`;

    return res.redirect(fullResumeUrl);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
