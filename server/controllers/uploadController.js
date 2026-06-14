const asyncHandler = require("express-async-handler");

// @desc    Upload an image to S3
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a file");
  }

  // multer-s3 attaches the S3 URL to req.file.location
  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    url: req.file.location, // Public S3 URL
  });
});

module.exports = {
  uploadImage,
};
