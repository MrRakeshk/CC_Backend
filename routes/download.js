const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const router = express.Router();
const ApplicantSchema = mongoose.model("JobApplicantInfo");

router.get("/resume/:applicantId", async (req, res) => {
  try {
    const applicant = await ApplicantSchema.findById(req.params.applicantId);

    // Accept both resumeUrl and resume
    const resumeUrl = applicant?.resumeUrl || applicant?.resume;

    if (!applicant || !resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const cloudinaryUrl = resumeUrl + "?fl_attachment=true";

    const response = await axios.get(cloudinaryUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume-${applicant.name || "user"}.pdf`
    );

    response.data.pipe(res);
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
