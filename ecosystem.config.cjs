const path = require("path");
try {
  require("dotenv").config({ path: path.join(__dirname, "server/.env") });
} catch (e) {}

module.exports = {
  apps: [
    {
      name: "rce-backend",
      cwd: "./server",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5024,
        MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rce_website",
        CLIENT_URL: process.env.CLIENT_URL || "https://rce.gemshine.tech",
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
        CLOUDINARY_URL: process.env.CLOUDINARY_URL || "",
      }
    }
  ]
};
