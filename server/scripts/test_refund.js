const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const User = require("../models/User");
const fetch = require("node-fetch");
require("dotenv").config();

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected.");

    // Find a confirmed booking to cancel
    let booking = await Booking.findOne({ status: "confirmed" });
    if (!booking) {
      console.log("No confirmed booking found to test cancellation.");
      process.exit(0);
    }

    // Set stripePaymentIntentId and some dummy CineCoins on booking to verify adjustment
    booking.stripePaymentIntentId = "pi_mock_intent_12345";
    booking.coinsUsed = 50;
    booking.coinsEarned = 10;
    await booking.save();
    console.log(`Prepared test booking ID: ${booking._id.toString()}`);

    // Set user's initial CineCoins
    const user = await User.findById(booking.user);
    const initialCoins = user.cineCoins || 0;
    console.log(`User initial CineCoins balance: ${initialCoins}`);

    // Log in as admin to get token
    console.log("Logging in as admin...");
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "admin123" })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;

    // Call cancellation API
    console.log("Sending cancellation request...");
    const cancelRes = await fetch(`http://localhost:5000/api/bookings/${booking._id.toString()}/cancel`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const cancelData = await cancelRes.json();
    console.log("Response Status:", cancelRes.status);
    console.log("Response Message:", cancelData.message);

    // Refresh user profile and check adjusted balance
    const updatedUser = await User.findById(booking.user);
    const expectedCoins = initialCoins + booking.coinsUsed - booking.coinsEarned;
    console.log(`Updated CineCoins balance: ${updatedUser.cineCoins} (Expected: ${expectedCoins})`);

    if (updatedUser.cineCoins === expectedCoins) {
      console.log("SUCCESS: CineCoins balance correctly adjusted!");
    } else {
      console.log("FAILURE: CineCoins balance mismatch.");
    }

    // Restore booking status to test again later if needed
    booking.status = "confirmed";
    booking.stripeStatus = "pending";
    await booking.save();
    console.log("Test booking status restored to confirmed.");

    process.exit(0);
  } catch (error) {
    console.error("Test Error:", error);
    process.exit(1);
  }
}

runTest();
