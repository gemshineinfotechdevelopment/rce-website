const express = require("express");
const cors = require("cors");
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
