const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const http = require("http");
const { execSync } = require("child_process");
const app = require("./app");
const connectDB = require("./config/db");

let currentPort = parseInt(process.env.PORT || "5024", 10);
const HOST = process.env.HOST || "0.0.0.0";
const { syncWithDatabase } = require("./controllers/clubController");

let retryCount = 0;
const MAX_RETRIES = 3;

// Automatically terminate any orphaned Windows process holding this port
function freePort(port) {
  if (process.platform !== "win32") return;
  try {
    const netstat = execSync(`netstat -ano | findstr :${port}`, { stdio: ["pipe", "pipe", "ignore"] }).toString();
    const lines = netstat.trim().split(/\r?\n/);
    let killed = false;
    for (const line of lines) {
      if (line.includes("LISTENING")) {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[parts.length - 1], 10);
        if (pid && pid !== process.pid && pid > 4) {
          console.warn(`🧹 Auto-clearing stale process (PID: ${pid}) holding port ${port}...`);
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
            killed = true;
          } catch (e) {}
        }
      }
    }
    if (killed) {
      // Small pause for Windows TCP stack to release socket
      try {
        execSync("ping 127.0.0.1 -n 2 > nul", { shell: "cmd.exe", stdio: "ignore" });
      } catch (e) {}
    }
  } catch (e) {
    // Port is free or netstat found no listener
  }
}

function startListening() {
  freePort(currentPort);

  const server = http.createServer(app);

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      retryCount++;
      freePort(currentPort);

      if (retryCount <= MAX_RETRIES) {
        console.warn(
          `⚠️ Port ${currentPort} is busy. Retrying in 1s (${retryCount}/${MAX_RETRIES})...`
        );
        setTimeout(() => {
          try { server.close(); } catch (e) {}
          startListening();
        }, 1000);
        return;
      }
      
      // Fallback: try next port if 5024 is strictly blocked
      console.warn(`⚠️ Port ${currentPort} remains occupied. Falling back to port ${currentPort + 1}...`);
      currentPort = currentPort + 1;
      retryCount = 0;
      setTimeout(() => startListening(), 500);
      return;
    }
    console.error("❌ Server error:", err);
    process.exit(1);
  });

  server.listen(currentPort, HOST, () => {
    retryCount = 0;
    console.log(`===============================================`);
    console.log(`🚀 Backend server is running on PORT: ${currentPort}`);
    console.log(`🌐 API URL: http://localhost:${currentPort}`);
    console.log(`🩺 Health Check: http://localhost:${currentPort}/api/health`);
    console.log(`ℹ️ Frontend (Vite) proxies http://localhost:5173/api -> http://localhost:${currentPort}`);
    console.log(`===============================================`);
  });

  // Nodemon graceful reload support
  process.once("SIGUSR2", () => {
    try {
      server.close(() => process.kill(process.pid, "SIGUSR2"));
    } catch (e) {
      process.kill(process.pid, "SIGUSR2");
    }
  });

  // Process termination handling
  const cleanExit = () => {
    try { server.close(() => process.exit(0)); } catch (e) { process.exit(0); }
    setTimeout(() => process.exit(0), 1000).unref();
  };

  process.on("SIGINT", cleanExit);
  process.on("SIGTERM", cleanExit);
}

async function startServer() {
  try {
    startListening();

    // Connect to DB asynchronously (doesn't block server listening)
    connectDB()
      .then(() => syncWithDatabase())
      .catch((err) => {
        console.warn("MongoDB connection notice:", err.message);
      });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
