const authRouter = require("./auth");
const userRouter = require("./user");
const jobRouter = require("./job");
const applicationRouter = require("./applications");
const ratingRouter = require("./rating");
const uploadImageRouter = require("./uploadImage");
const uploadResumeRouter = require("./uploadResume");
const downloadResumeRouter = require("./downloadResume");
const applicantRouter = require("./applicant");

const initRouter = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/jobs", jobRouter);
  app.use("/api/applications", applicationRouter);
  app.use("/api/rating", ratingRouter);
  app.use("/api/upload/image", uploadImageRouter);
  app.use("/api/upload/resume", uploadResumeRouter);
  app.use("/api/download/resume", downloadResumeRouter);
  app.use("/api/applicants", applicantRouter);
};

module.exports = initRouter;
