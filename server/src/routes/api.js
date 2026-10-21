const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../controllers/statusController");

// Health check endpoint
router.get("/health", getHealthStatus);

// Sample API route
router.get("/message", (req, res) => {
  res.json({
    message: "Vanakkam! Backend connection working from port " + (process.env.PORT || 5000),
  });
});

module.exports = router;
