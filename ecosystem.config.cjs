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
        MONGO_URI: "mongodb://127.0.0.1:27017/rce_website",
        CLIENT_URL: "https://rce.gemshine.tech"
      }
    }
  ]
};

