const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const router = express.Router();
const ApplicantSchema = mongoose.model("JobApplicantInfo");

router.get("/resume/:applicantId", async (req, res) => {
  try {
    console.log("⏳ Fetching applicant...");
    const applicant = await ApplicantSchema.findById(req.params.applicantId);

    if (!applicant) {
      console.log("❌ Applicant not found");
      return res.status(404).json({ message: "Applicant not found" });
    }

    const resumeUrl = applicant.resumeUrl || applicant.resume;

    if (!resumeUrl) {
      console.log("❌ Resume URL missing");
      return res.status(404).json({ message: "Resume not found" });
    }

    const downloadUrl = resumeUrl.includes("fl_attachment=true")
      ? resumeUrl
      : `${resumeUrl}?fl_attachment=true`;

    console.log("📡 Downloading from:", downloadUrl);

    const response = await axios.get(downloadUrl, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume-${applicant.name || "user"}.pdf`
    );

    response.data.pipe(res);
  } catch (err) {
    console.error("🚨 ERROR during resume download:", err.message);
    if (err.response) {
      console.error("🌐 Cloudinary Status:", err.response.status);
      console.error("📄 Cloudinary Response:", err.response.data);
    }
    res.status(500).json({
      message: "Server error while downloading resume",
      error: err.message,
    });
  }
});

module.exports = router;
