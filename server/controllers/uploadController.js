const asyncHandler = require("express-async-handler");
const fetch = require("node-fetch");

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

// @desc    Proxy an external image to bypass CORS limits
// @route   GET /api/proxy-image
// @access  Public
const proxyImage = asyncHandler(async (req, res) => {
  const { url } = req.query;
  if (!url) {
    res.status(400);
    throw new Error("URL parameter is required");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.buffer();
    
    res.set("Content-Type", contentType);
    res.set("Access-Control-Allow-Origin", "*");
    res.send(buffer);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to proxy image: " + error.message);
  }
});

module.exports = {
  uploadImage,
  proxyImage,
};
