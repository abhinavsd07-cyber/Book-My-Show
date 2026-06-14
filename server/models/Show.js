const mongoose = require("mongoose");

const seatCategorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  rows: { type: Number, default: 4 },
  seatsPerRow: { type: Number, default: 10 },
  bookedSeats: [{ type: String }],
});

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
    screen: { type: String, default: "Screen 1" },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    format: { type: String, enum: ["2D", "3D", "IMAX", "4DX"], default: "2D" },
    language: { type: String, default: "English" },
    seats: {
      gold: { type: seatCategorySchema },
      platinum: { type: seatCategorySchema },
      recliner: { type: seatCategorySchema },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
