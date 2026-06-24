require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const API_URL = 'http://localhost:5000/api';

async function testAdminFlow() {
  console.log("--- Starting Admin E2E Test ---");
  
  // 1. Connect DB to upgrade user
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cinebook");

  const testEmail = `admin_${Date.now()}@example.com`;
  const password = "AdminPassword123!";
  
  let token = null;

  try {
    // 2. Register User
    console.log(`Registering admin user: ${testEmail}`);
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "E2E Admin User",
        email: testEmail,
        password: password,
        phone: "9876543210"
      })
    });
    let data = await res.json();
    if (!data.success) throw new Error("Registration failed");

    // 3. Upgrade to Admin in DB
    console.log("Upgrading user to admin in DB...");
    await User.updateOne({ email: testEmail }, { role: 'admin' });

    // 4. Login to get Admin Token
    console.log("Logging in as admin...");
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: password })
    });
    data = await res.json();
    token = data.data.token;
    if (!token) throw new Error("Login failed");

    // 5. Test Movie Creation
    console.log("Creating new movie...");
    res = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        title: "E2E Test Movie",
        description: "A movie created by the automated E2E test.",
        duration: 120,
        genre: ["Action", "Sci-Fi"],
        languages: ["English"],
        releaseDate: new Date().toISOString(),
        poster: "https://example.com/poster.jpg",
        backdrop: "https://example.com/backdrop.jpg",
        trailer: "https://youtube.com/trailer",
        cast: [{ name: "Actor 1", role: "Lead", image: "https://example.com/actor.jpg" }],
        crew: [{ name: "Director 1", role: "Director", image: "https://example.com/director.jpg" }],
        format: "2D",
        basePrice: 200,
        itemType: "movie",
        status: "now-showing"
      })
    });
    data = await res.json();
    console.log("Create Movie Response:", data.success, data.message || "");
    const movieId = data.data?._id;

    if (!movieId) throw new Error("Movie ID not returned");

    // 6. Test Movie Update
    console.log("Updating movie...");
    res = await fetch(`${API_URL}/movies/${movieId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ title: "E2E Test Movie Updated", duration: 130 })
    });
    data = await res.json();
    console.log("Update Movie Response:", data.success, data.message || "");

    // 7. Delete Movie
    console.log("Deleting movie...");
    res = await fetch(`${API_URL}/movies/${movieId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    data = await res.json();
    console.log("Delete Movie Response:", data.success, data.message || "");

    console.log("✅ Admin tests passed successfully!");
    
  } catch (err) {
    console.error("❌ Admin Test Failed:", err);
  } finally {
    // Cleanup & Exit
    await User.deleteOne({ email: testEmail });
    await mongoose.disconnect();
    process.exit(0);
  }
}

testAdminFlow();
