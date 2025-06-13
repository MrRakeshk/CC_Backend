const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const https = require("https");
const router = express.Router();

const ApplicantSchema = mongoose.model("JobApplicantInfo");

// Route: GET /api/download/resume/:applicantId
router.get("/resume/:applicantId", async (req, res) => {
  try {
    const applicant = await ApplicantSchema.findById(req.params.applicantId);

    if (!applicant || !applicant.resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const cloudinaryUrl = applicant.resumeUrl + "?fl_attachment=true";

    const fileResponse = await axios.get(cloudinaryUrl, {
      responseType: "stream",
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume-${applicant.name || "user"}.pdf`
    );

    fileResponse.data.pipe(res);
  } catch (err) {
    console.error("Resume download error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
