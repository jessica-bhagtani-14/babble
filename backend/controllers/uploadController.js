const asyncHandler = require("express-async-handler");
const { cloudinary } = require("../config/cloudinary");

//@description     Upload image to Cloudinary
//@route           POST /api/upload/image
//@access          Public
const uploadImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided");
    }

    // The image is already uploaded to Cloudinary by multer-storage-cloudinary
    // We just need to return the URL
    const imageUrl = req.file.path;

    res.status(200).json({
      success: true,
      url: imageUrl,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Upload failed: ${error.message}`);
  }
});

//@description     Delete image from Cloudinary
//@route           DELETE /api/upload/image/:publicId
//@access          Public
const deleteImage = asyncHandler(async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      res.status(400);
      throw new Error("Public ID is required");
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      result
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Delete failed: ${error.message}`);
  }
});

module.exports = { uploadImage, deleteImage }; 