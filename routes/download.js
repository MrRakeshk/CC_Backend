const express = require("express");
const fs = require("fs");
const path = require("path");
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

    const resumeFile = applicant.resume;

    if (!resumeFile) {
      return res.status(404).json({ message: "Resume not found for this applicant" });
    }

    const filePath = path.join(__dirname, "../files", resumeFile);
    console.log("Serving resume file from:", filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File access error:", err);
        return res.status(404).json({ message: "Resume file not found" });
      }

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
