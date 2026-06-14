import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="bms-footer" id="contact">
    {/* ── Footer Top Cards ── */}
    <div className="footer-top-strip">
      <div className="container">
        <div className="contact-cards">
          <div className="contact-card">
            <div className="contact-icon">🎧</div>
            <h5>24/7 CUSTOMER CARE</h5>
          </div>
          <div className="contact-card">
            <div className="contact-icon">🎟️</div>
            <h5>RESEND BOOKING CONFIRMATION</h5>
          </div>
          <div className="contact-card">
            <div className="contact-icon">✉️</div>
            <h5>SUBSCRIBE TO THE NEWSLETTER</h5>
          </div>
        </div>
      </div>
    </div>

    {/* ── Footer Main Links ── */}
    <div className="footer-main">
      <div className="container">
        <div className="footer-brand-strip">
          <div className="line"></div>
          <div className="footer-logo">
             book<strong>my</strong>show
          </div>
          <div className="line"></div>
        </div>

        <div className="social-links-row">
          <a href="#" className="social-circle">f</a>
          <a href="#" className="social-circle">𝕏</a>
          <a href="#" className="social-circle">in</a>
          <a href="#" className="social-circle">ig</a>
          <a href="#" className="social-circle">yt</a>
        </div>

        <div className="footer-text-block">
          <p>
            Copyright {new Date().getFullYear()} © Bigtree Entertainment Pvt. Ltd. All Rights Reserved.
            <br />
            The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the works and no endorsement of the artist shall be implied. Unauthorized use is prohibited and punishable by law.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
