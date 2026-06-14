import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation as useRouteLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocationContext } from "../context/LocationContext";
import { useThemeContext } from "../context/ThemeContext";
import { getAllMovies } from "../config/allApis";
import { FaLandmark, FaBuilding, FaCity, FaIndustry, FaTree, FaMonument, FaArchway, FaMosque, FaDharmachakra, FaMoon, FaSun } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import "./Header.css";

const POPULAR_CITIES = [
  { name: "Mumbai", icon: <FaLandmark size={32} color="#F84464" /> },
  { name: "Delhi-NCR", icon: <FaMonument size={32} color="#F84464" /> },
  { name: "Bengaluru", icon: <FaBuilding size={32} color="#F84464" /> },
  { name: "Hyderabad", icon: <FaMosque size={32} color="#F84464" /> },
  { name: "Chandigarh", icon: <FaCity size={32} color="#F84464" /> },
  { name: "Ahmedabad", icon: <FaIndustry size={32} color="#F84464" /> },
  { name: "Pune", icon: <FaBuilding size={32} color="#F84464" /> },
  { name: "Chennai", icon: <FaDharmachakra size={32} color="#F84464" /> },
  { name: "Kolkata", icon: <FaArchway size={32} color="#F84464" /> },
  { name: "Kochi", icon: <FaTree size={32} color="#F84464" /> },
];

const Header = () => {
  const { user, logout } = useAuth();
  const { location, changeLocation } = useLocationContext();
  const { theme, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await getAllMovies({ search });
        setResults(res.data.data.slice(0, 5));
      } catch { setResults([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setResults([]);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCitySelect = (city) => {
    changeLocation(city);
    setLocationModalOpen(false);
  };

  const navLinksMain = [
    { label: "Movies", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Stream", path: "/#stream" },
    { label: "Events", path: "/#events" },
    { label: "Plays", path: "/#plays" },
    { label: "Sports", path: "/#sports" },
    { label: "Activities", path: "/#activities" },
  ];

  const navLinksSecondary = [
    { label: "ListYourShow", path: "/#list" },
    { label: "Corporates", path: "/#corporates" },
    { label: "Offers", path: "/#offers" },
    { label: "Gift Cards", path: "/#giftcards" },
  ];

  return (
    <header className="bms-header">
      {/* Top Main Bar */}
      <div className="header-top">
        <div className="container header-top-inner">
          <div className="header-left">
            <Link to="/" className="bms-logo">
              <span className="logo-text">book<strong className="logo-accent">my</strong>show</span>
            </Link>
            <div className="search-wrapper" ref={searchRef}>
              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search for Movies, Events, Plays, Sports and Activities"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              {results.length > 0 && (
                <div className="search-dropdown">
                  {results.map((m) => (
                    <div key={m._id} className="search-result-item" onClick={() => { navigate(`/movie/${m._id}`); setSearch(""); setResults([]); }}>
                      <img src={m.poster} alt={m.title} />
                      <div>
                        <span className="result-title">{m.title}</span>
                        <span className="result-genre">{m.genre?.join(", ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="header-right">
            <button className="theme-toggle-btn" onClick={toggleTheme} style={{ background: "transparent", color: "var(--clr-text)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", marginRight: "16px" }}>
              {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>

            <button className="location-btn" onClick={() => setLocationModalOpen(true)}>
              {location} 
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            {user ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button className="user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--clr-border)", objectFit: "cover" }} />
                  ) : null}
                  Hi, {user.name.split(" ")[0]}
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/my-bookings" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      Your Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button className="dropdown-item" onClick={() => { logout(); navigate("/"); setUserMenuOpen(false); }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm signin-btn">Sign in</Link>
            )}

            <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Bottom Bar */}
      <div className="header-bottom">
        <div className="container header-bottom-inner">
          <nav className="nav-left">
            {navLinksMain.map((link) => (
              <Link key={link.label} to={link.path} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="nav-right">
            {navLinksSecondary.map((link) => (
              <Link key={link.label} to={link.path} className="nav-link nav-link-dim">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="location-modal-overlay" onClick={() => setLocationModalOpen(false)}>
          <div className="location-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="location-search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" width="18" height="18">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search for your city" className="location-search-input" />
            </div>
            
            <div className="detect-location-strip">
              <span className="detect-icon"><FaLocationCrosshairs /></span> Detect my location
            </div>

            <div className="popular-cities-section">
              <h4 className="popular-cities-title">Popular Cities</h4>
              <div className="cities-grid">
                {POPULAR_CITIES.map((city) => (
                  <div key={city.name} className="city-item" onClick={() => handleCitySelect(city.name)}>
                    <div className="city-icon">{city.icon}</div>
                    <div className="city-name">{city.name}</div>
                  </div>
                ))}
              </div>
              <div className="view-all-cities">
                <button className="btn btn-ghost" style={{ color: "var(--clr-primary)" }}>View All Cities</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Hey!</h3>
              <button onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <div className="mobile-menu-content">
              {navLinksMain.map((link) => (
                <Link key={link.label} to={link.path} onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
