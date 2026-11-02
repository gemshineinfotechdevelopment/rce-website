const getHealthStatus = (req, res) => {
  res.json({
    status: "healthy",
    message: "RCE Website Backend Server is running successfully!",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealthStatus };
