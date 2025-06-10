const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

router.get("/resume/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid applicant ID" });
  }

  try {
    const applicant = await ApplicantSchema.findById(id);

    if (!applicant || !applicant.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumeUrl = applicant.resume;

    // Fetch file from Cloudinary URL and stream to client
    const response = await axios({
      url: resumeUrl,
      method: "GET",
      responseType: "stream",
    });

    // Set headers to download as attachment
    res.setHeader("Content-Disposition", `attachment; filename=resume.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
