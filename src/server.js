require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const analyticsRoutes = require("./routes/analytics");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "https://ericcapiz.com",
      "https://www.ericcapiz.com",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:3000",
    ],
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/analytics", analyticsRoutes);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ status: "Analytics API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
