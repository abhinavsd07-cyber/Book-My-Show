import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, getProfile } from "../config/allApis";
import SEO from "../components/SEO";
import "./Profile.css";

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Simba"
];

export default function Profile() {
  const { user, login } = useAuth(); // login function from context acts as a "set user"
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [cineCoins, setCineCoins] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        avatar: user.avatar || AVATARS[0]
      });
      getProfile().then(res => setCineCoins(res.data.data.cineCoins || 0)).catch(err => console.error(err));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (url) => {
    setFormData({ ...formData, avatar: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    
    try {
      const res = await updateProfile(formData);
      // The updateProfile API returns the updated user, but it doesn't return the token.
      // We must preserve the existing token in local storage and update context.
      const updatedUser = { ...res.data.data, token: user.token };
      login(updatedUser); // This updates localStorage and AuthContext
      
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="page-wrapper flex-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-page page-wrapper">
      <SEO title="My Profile" description="Manage your Book My Show account and choose your avatar." url="/profile" />
      
      <div className="container">
        <div className="profile-card card">
          <div className="profile-header">
            <h2>My Profile</h2>
            <p className="text-muted">Update your account details and choose how you appear to others.</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", padding: "20px", borderRadius: "12px", color: "white", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>🪙 CineCoins Balance</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", opacity: 0.9 }}>Earn coins on every booking!</p>
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              {cineCoins}
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            
            {successMsg && <div className="alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert-error">{errorMsg}</div>}

            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-input" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={user.email} 
                  disabled 
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                />
                <small className="text-dim">Email address cannot be changed.</small>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-input" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Choose an Avatar</h3>
              <p className="text-muted mb-4">Select an avatar that represents you. This will be visible on your reviews.</p>
              
              <div className="avatar-grid">
                {AVATARS.map((url, idx) => (
                  <div 
                    key={idx} 
                    className={`avatar-option ${formData.avatar === url ? "selected" : ""}`}
                    onClick={() => handleAvatarSelect(url)}
                  >
                    <img src={url} alt={`Avatar ${idx + 1}`} />
                    {formData.avatar === url && <div className="avatar-check">✓</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                {loading ? "Saving changes..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
