require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5024;
const { syncWithDatabase } = require("./controllers/clubController");

async function startServer() {
  try {
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Backend server is running on PORT: ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Connect to DB asynchronously (doesn't block server listening)
    connectDB()
      .then(() => {
        return syncWithDatabase();
      })
      .catch((err) => {
        console.warn("MongoDB connection notice:", err.message);
      });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
