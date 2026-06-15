const asyncHandler = require("express-async-handler");
const Banner = require("../models/Banner");

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: banners,
  });
});

// @desc    Get all banners (including inactive)
// @route   GET /api/admin/banners
// @access  Private/Admin
const getAllAdminBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: banners,
  });
});

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
  const { imageUrl, type, targetLink } = req.body;

  if (!imageUrl || !type) {
    res.status(400);
    throw new Error("Please provide image URL and banner type");
  }

  const banner = await Banner.create({
    imageUrl,
    type,
    targetLink,
  });

  res.status(201).json({
    success: true,
    data: banner,
  });
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner removed",
  });
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const { imageUrl, type, targetLink } = req.body;
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  banner.imageUrl = imageUrl || banner.imageUrl;
  banner.type = type || banner.type;
  banner.targetLink = targetLink !== undefined ? targetLink : banner.targetLink;

  const updatedBanner = await banner.save();

  res.status(200).json({
    success: true,
    data: updatedBanner,
  });
});

module.exports = {
  getBanners,
  getAllAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
