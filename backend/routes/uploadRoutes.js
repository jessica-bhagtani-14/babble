const express = require("express");
const { uploadImage, deleteImage } = require("../controllers/uploadController");
const { upload } = require("../config/cloudinary");

const router = express.Router();

// Test route to verify upload routes are loaded
router.get("/test", (req, res) => {
  res.json({ message: "Upload routes are working!" });
});

// Upload single image
router.post("/image", upload.single("image"), uploadImage);

// Delete image by public ID
router.delete("/image/:publicId", deleteImage);

module.exports = router; 