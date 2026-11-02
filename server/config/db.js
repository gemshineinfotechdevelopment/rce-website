const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rce_website";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name || "rce_website"})`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Skipped/Failed (${uri}): ${error.message}`);
    console.warn(`ℹ️ Server will continue operating with local clubData.json file backup.`);
  }
};

module.exports = connectDB;
