const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const apiRoutes = require("./routes/api");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded static assets
app.use("/api/uploads", express.static(uploadsDir));
app.use("/uploads", express.static(uploadsDir));

// CORS configuration - Allow frontend port & production domain
const clientUrl = process.env.CLIENT_URL || "https://rce.gemshine.tech";
const allowedOrigins = [
  clientUrl,
  "https://rce.gemshine.tech",
  "http://rce.gemshine.tech",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5024",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5024"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith("gemshine.tech")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive behind reverse proxy
    },
    credentials: true,
  })
);

// Body parsers with generous limit for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
