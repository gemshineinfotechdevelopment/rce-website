const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

const uploadFile = (req, res) => {
  try {
    // 1. If uploaded via Multer (multipart/form-data)
    if (req.file) {
      const publicUrl = `/api/uploads/${req.file.filename}`;
      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully!",
        data: {
          url: publicUrl,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        url: publicUrl,
      });
    }

    // 2. If uploaded via Base64 JSON
    const { image, name, filename } = req.body;
    if (image && typeof image === "string") {
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      let ext = ".jpg";
      let base64Data = image;

      if (image.startsWith("data:")) {
        const matches = image.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mime = matches[1];
          base64Data = matches[2];
          if (mime.includes("png")) ext = ".png";
          else if (mime.includes("webp")) ext = ".webp";
          else if (mime.includes("gif")) ext = ".gif";
          else if (mime.includes("svg")) ext = ".svg";
          else ext = ".jpg";
        }
      }

      const cleanName =
        (name || filename || "photo")
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "")
          .slice(0, 30) || "photo";

      const uniqueFilename = `${cleanName}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);

      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      const publicUrl = `/api/uploads/${uniqueFilename}`;

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully!",
        data: {
          url: publicUrl,
          filename: uniqueFilename,
        },
        url: publicUrl,
      });
    }

    return res.status(400).json({
      success: false,
      message: "No file or image data provided for upload",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image: " + error.message,
    });
  }
};

module.exports = { uploadFile };
