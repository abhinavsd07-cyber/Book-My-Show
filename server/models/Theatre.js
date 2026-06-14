const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: "" },
    totalScreens: { type: Number, default: 1 },
    amenities: [{ type: String }],
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theatre", theatreSchema);
