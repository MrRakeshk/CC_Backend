const express = require("express");
const mongoose = require("mongoose");
const ApplicantSchema = mongoose.model("JobApplicantInfo");

const router = express.Router();


// GET route to download a resume by filename
router.get("/resume/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "../public/resumes", filename);

  if (fs.existsSync(filepath)) {
    res.download(filepath, filename, (err) => {
      if (err) {
        res.status(500).json({ message: "Download error", error: err.message });
      }
    });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;
