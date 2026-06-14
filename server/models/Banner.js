const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Please add an image URL"],
    },
    type: {
      type: String,
      enum: ["hero", "middle"],
      required: [true, "Please specify the banner type (hero or middle)"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    targetLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
