// 1. Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./middleware/passportConfig");
const cors = require("cors");
require("dotenv").config();

const initRouter = require("./routes");

const app = express();
const port = 5001;

// ✅ Correct CORS configuration
const corsOptions = {
  origin: "https://cc-frontend-dusky.vercel.app", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Apply CORS before routes and other middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://mrrakeshk1704:Rakeshk2003@cluster0.h5n5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passportConfig.initialize());

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Job Portal API!");
});

// Initialize app routes
initRouter(app);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

