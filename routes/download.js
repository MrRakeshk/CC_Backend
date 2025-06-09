const express = require("express");
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();

router.get("/resume/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find applicant by MongoDB _id
    const applicant = await ApplicantSchema.findById(id);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const resumeFile = applicant.resume;

    if (!resumeFile) {
      return res.status(404).json({ message: "Resume not found for this applicant" });
    }

    // Construct full path to the file (matches your upload folder)
    const filePath = path.join(__dirname, "../files", resumeFile);

    // Check if file exists and is accessible
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File access error:", err);
        return res.status(404).json({ message: "Resume file not found" });
      }

      // Send the file for download
      res.download(filePath, (err) => {
        if (err) {
          console.error("Error during file download:", err);
          return res.status(500).json({ message: "Failed to download resume" });
        }
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
