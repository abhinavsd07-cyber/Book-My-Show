import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import "./TicketScanner.css";

export default function TicketScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Only init once
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = async (decodedText) => {
      // Pause scanning on success to prevent multiple API calls
      scanner.pause();
      setScanResult(decodedText);
      setStatus("loading");
      setMessage("Verifying ticket...");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin/verify-ticket/${decodedText}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStatus("success");
        setMessage(`✅ ${res.data.message}\nUser: ${res.data.data.user}\nSeats: ${res.data.data.seats.join(", ")}`);
        
        // Play success sound
        const audio = new Audio("https://actions.google.com/sounds/v1/ui/beep_short.ogg");
        audio.play().catch(e => console.log("Audio play prevented"));

      } catch (err) {
        setStatus("error");
        setMessage(`❌ ${err.response?.data?.message || "Invalid Ticket!"}`);
        
        // Play error sound
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play().catch(e => console.log("Audio play prevented"));
      }

      // Resume scanning after 4 seconds
      setTimeout(() => {
        setScanResult(null);
        setStatus("idle");
        setMessage("");
        scanner.resume();
      }, 4000);
    };

    scanner.render(onScanSuccess, (err) => {
      // ignore frame errors
    });

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return (
    <div className="ticket-scanner-page page-wrapper">
      <div className="container">
        <div className="scanner-header">
          <h1>Staff Scanner</h1>
          <p className="text-muted">Point camera at customer's QR code to admit</p>
        </div>

        <div className="scanner-container glass">
          <div id="reader" className="qr-reader"></div>
          
          {status !== "idle" && (
            <div className={`scan-overlay ${status}`}>
              <div className="overlay-content">
                {status === "loading" && <div className="spinner"></div>}
                <div style={{ whiteSpace: "pre-line", fontSize: "1.2rem", fontWeight: "bold" }}>
                  {message}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
