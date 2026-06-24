const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log("--- Starting Auth E2E Test ---");
  const testEmail = `testuser_${Date.now()}@example.com`;
  const password = "Password123!";
  
  let token = null;

  try {
    // 1. Register
    console.log(`Registering user with email: ${testEmail}`);
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "E2E Test User",
        email: testEmail,
        password: password,
        phone: "9876543210"
      })
    });
    let data = await res.json();
    console.log("Register Response:", data.success);

    // 2. Login
    console.log("Logging in...");
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: password
      })
    });
    data = await res.json();
    console.log("Login Response:", data.success);
    token = data.data.token;

    // 3. Update Profile
    console.log("Fetching profile...");
    res = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    data = await res.json();
    console.log("Profile Fetch:", data.success, data.message || "");

    console.log("Updating profile...");
    res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ name: "E2E Test User Updated" })
    });
    data = await res.json();
    console.log("Update Response:", data.success, data.message || "");
    
    // Check update success
    res = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    data = await res.json();
    console.log("Updated Name:", data.data ? data.data.name : "NO DATA");

    if (data.data && data.data.name === "E2E Test User Updated") {
      console.log("✅ Auth & Profile tests passed successfully!");
    } else {
      console.error("❌ Profile update failed validation.");
    }
    
  } catch (err) {
    console.error("❌ Auth Test Failed:", err);
  }
}

testAuth();
