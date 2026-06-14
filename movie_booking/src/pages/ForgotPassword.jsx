import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../config/allApis";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await forgotPassword({ email });
      setSuccess("If that email exists, we have sent a password reset link.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="text-dim text-center mb-6">Enter your email to receive a password reset link.</p>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success" style={{ color: "var(--clr-accent)", background: "rgba(255,60,106,0.1)", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="name@example.com"
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-footer text-center mt-4">
          Remember your password? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
