const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

// @desc    Validate a promo code
// @route   POST /api/coupons/validate
// @access  Public (or Private if you want only logged-in users)
const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Please provide a coupon code");
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error("Invalid promo code");
  }

  if (!coupon.isActive) {
    res.status(400);
    throw new Error("This promo code has expired or is inactive");
  }

  res.status(200).json({
    success: true,
    data: {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
    },
  });
});

module.exports = { validateCoupon };
