const express = require("express");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ============================
// TEXT MESSAGE
// ============================

router.post(
  "/",
  sendMessage
);

// ============================
// GET MESSAGE HISTORY
// ============================

router.get(
  "/",
  getMessages
);

// ============================
// FILE UPLOAD
// ============================

router.post(
  "/upload",
  upload.single("file"),
  (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      res.status(200).json({
        success: true,

        file: {
          fileUrl:
            `/uploads/${req.file.filename}`,

          fileName:
            req.file.originalname,

          fileType:
            req.file.mimetype,

          fileSize:
            req.file.size,
        },
      });

    } catch (error) {

      console.error(
        "File upload error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "File upload failed",
      });

    }

  }
);

module.exports = router;