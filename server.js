// 1. Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./middleware/passportConfig");
const cors = require("cors");
require("dotenv").config();

const initRouter = require("./routes");

// 2. Initialize Express application
const app = express();
const port = 5001;

// 3. Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://mrrakeshk1704:Rakeshk2003@cluster0.h5n5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

// 4. Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// 5. Define routes
app.get('/', (req, res) => {
  res.send('Welcome to Job Portal API!');
});

// Initialize routes
initRouter(app);

// 6. Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
