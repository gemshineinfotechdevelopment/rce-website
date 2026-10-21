const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// CORS configuration - Allow frontend port
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: [clientUrl, "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get("/", (req, res) => {
  res.json({
    project: "RCE Website API",
    status: "running",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// API Routes
app.use("/api", apiRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
