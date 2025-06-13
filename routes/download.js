const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const router = express.Router();
const ApplicantSchema = mongoose.model("JobApplicantInfo");

router.get("/resume/:applicantId", async (req, res) => {
  try {
    const applicant = await ApplicantSchema.findById(req.params.applicantId);

    const resumeUrl = applicant?.resumeUrl || applicant?.resume;

    if (!applicant || !resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const downloadUrl = resumeUrl.includes("fl_attachment=true")
      ? resumeUrl
      : resumeUrl + "?fl_attachment=true";

    // 📦 Attempt to stream the file
    const fileResponse = await axios.get(downloadUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume-${applicant.name || "user"}.pdf`
    );

    fileResponse.data.pipe(res);
  } catch (err) {
    console.error("🔴 Resume Download Error:", err.message);
    if (err.response?.status) {
      console.error("Cloudinary status:", err.response.status);
      console.error("Cloudinary data:", err.response.data);
    }
    res.status(500).json({
      message: "Server error while downloading resume",
      error: err.message,
    });
  }
});

module.exports = router;
