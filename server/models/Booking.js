const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => "BK" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
    seats: [
      {
        type: { type: String },
        seatNumber: { type: String },
      },
    ],
    foodItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    convenienceFee: { type: Number, default: 0 },
    foodTotal: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    coinsEarned: { type: Number, default: 0 },
    coinsUsed: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },
    stripeStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    isScanned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "pending"],
      default: "pending",
    },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
