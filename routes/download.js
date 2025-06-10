const express = require("express");
const { default: mongoose } = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

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

    const resumeUrl = applicant.resume;

    if (!resumeUrl) {
      return res.status(404).json({ message: "Resume not found for this applicant" });
    }

    // Redirect client to Cloudinary-hosted file
    return res.redirect(resumeUrl);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
