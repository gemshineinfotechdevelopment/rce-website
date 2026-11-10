const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const apiRoutes = require("./routes/api");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded static assets (with CORS enabled)
app.use("/api/uploads", express.static(uploadsDir));
app.use("/uploads", express.static(uploadsDir));

// Body parsers with generous limit for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Root welcome route for Backend API
app.get("/", (req, res) => {
  res.json({
    project: "RCE Website Backend API",
    status: "running",
    version: "1.0.0",
    docs: "/api/health",
    endpoints: {
      health: "/api/health",
      events: "/api/events",
      projects: "/api/projects",
      stories: "/api/stories",
      stats: "/api/stats",
      gallery: "/api/gallery",
      videos: "/api/videos",
    },
  });
});

// API Routes
app.use("/api", apiRoutes);

// Optional: Only serve static dist if explicitly enabled in production mode
if (process.env.SERVE_FRONTEND === "true") {
  const distDir = path.join(__dirname, "../dist");
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
