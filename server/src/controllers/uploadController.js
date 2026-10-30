const path = require("path");
const fs = require("fs");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

const uploadFile = async (req, res) => {
  try {
    const useCloudinary = isCloudinaryConfigured();
    const preset = process.env.CLOUDINARY_UPLOAD_PRESET ? process.env.CLOUDINARY_UPLOAD_PRESET.trim() : null;

    // 1. If uploaded via Multer (multipart/form-data)
    if (req.file) {
      if (useCloudinary) {
        try {
          let result;
          if (preset) {
            // Unsigned preset upload (bypasses restricted API key issues)
            result = await cloudinary.uploader.unsigned_upload(req.file.path, preset);
          } else {
            // Standard signed upload
            result = await cloudinary.uploader.upload(req.file.path, {
              folder: "rce_website",
              resource_type: "image",
            });
          }

          // Clean up local temp file after successful upload to Cloudinary
          try {
            if (fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
            }
          } catch (e) {}

          console.log("☁️ Image uploaded to Cloudinary successfully:", result.secure_url);

          return res.status(201).json({
            success: true,
            message: "Image uploaded to Cloudinary successfully!",
            data: {
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              size: result.bytes,
            },
            url: result.secure_url,
          });
        } catch (cloudErr) {
          console.warn("⚠️ Cloudinary upload failed:", cloudErr.message);
          // If Cloudinary fails, fallback to keeping the local file below
        }
      }

      // Local storage fallback (or default when Cloudinary not configured)
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
      if (useCloudinary) {
        try {
          const dataUri = image.startsWith("data:")
            ? image
            : `data:image/jpeg;base64,${image}`;

          let result;
          if (preset) {
            result = await cloudinary.uploader.unsigned_upload(dataUri, preset);
          } else {
            result = await cloudinary.uploader.upload(dataUri, {
              folder: "rce_website",
              resource_type: "image",
            });
          }

          console.log("☁️ Base64 image uploaded to Cloudinary successfully:", result.secure_url);

          return res.status(201).json({
            success: true,
            message: "Image uploaded to Cloudinary successfully!",
            data: {
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              size: result.bytes,
            },
            url: result.secure_url,
          });
        } catch (cloudErr) {
          console.warn("⚠️ Cloudinary base64 upload failed:", cloudErr.message);
        }
      }

      // Local storage for base64 fallback
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
