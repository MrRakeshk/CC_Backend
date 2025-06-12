const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
require("./middleware/passportConfig"); // register strategies
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const initRouter = require("./routes");

const app = express();
const port = 5001;

const corsOptions = {
  origin: "https://cc-frontend-dusky.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://mrrakeshk1704:Rakeshk2003@cluster0.h5n5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

// ✅ This will expose the /public/resume folder via /host/resume/
app.use("/host/resume", express.static(path.join(__dirname, "public/resume")));
// ✅ Routes
app.get("/", (req, res) => res.send("Welcome to Job Portal API!"));
initRouter(app);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// ✅ Start
app.listen(port, () => console.log(`Server started on port ${port}`));
