const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const http = require("http");
const { execSync } = require("child_process");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = parseInt(process.env.PORT || "5024", 10);
const HOST = process.env.HOST || "0.0.0.0";
const { syncWithDatabase } = require("./controllers/clubController");

let retryCount = 0;
const MAX_RETRIES = 5;

// Automatically terminate any orphaned Windows process holding this port
function freePort(port) {
  if (process.platform !== "win32") return;
  try {
    const netstat = execSync(`netstat -ano | findstr :${port}`).toString();
    const lines = netstat.trim().split("\n");
    for (const line of lines) {
      if (line.includes("LISTENING")) {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[parts.length - 1], 10);
        if (pid && pid !== process.pid && pid > 4) {
          console.warn(`🧹 Auto-clearing stale process (PID: ${pid}) holding port ${port}...`);
          try {
            execSync(`taskkill /F /PID ${pid}`);
          } catch (e) {}
        }
      }
    }
  } catch (e) {
    // Port is free or netstat found no listener
  }
}

function listenWithRetry(server) {
  server.listen(PORT, HOST, () => {
    retryCount = 0;
    console.log(`===============================================`);
    console.log(`🚀 Backend server is running on PORT: ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

async function startServer() {
  try {
    // Pre-emptively clear port 5024 if a zombie process is holding it
    freePort(PORT);

    const server = http.createServer(app);

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        retryCount++;
        // Attempt to forcefully release the port
        freePort(PORT);

        if (retryCount <= MAX_RETRIES) {
          console.warn(
            `⚠️ Port ${PORT} is temporarily busy. Retrying in 1.2s (${retryCount}/${MAX_RETRIES})...`
          );
          setTimeout(() => {
            try {
              server.close();
            } catch (e) {}
            listenWithRetry(server);
          }, 1200);
          return;
        }
        console.error(
          `❌ Port ${PORT} is permanently occupied by another process. Please close it and restart.`
        );
      } else {
        console.error("❌ Server error:", err);
      }
      process.exit(1);
    });

    listenWithRetry(server);

    // Nodemon graceful reload support
    process.once("SIGUSR2", () => {
      try {
        server.close(() => {
          process.kill(process.pid, "SIGUSR2");
        });
      } catch (e) {
        process.kill(process.pid, "SIGUSR2");
      }
    });

    // Process termination handling
    process.on("SIGINT", () => {
      try {
        server.close(() => process.exit(0));
      } catch (e) {
        process.exit(0);
      }
      setTimeout(() => process.exit(0), 1000).unref();
    });

    process.on("SIGTERM", () => {
      try {
        server.close(() => process.exit(0));
      } catch (e) {
        process.exit(0);
      }
      setTimeout(() => process.exit(0), 1000).unref();
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
