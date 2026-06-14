import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaChartPie, FaFilm, FaBuilding, FaChair, FaTicket, FaUsers, FaClapperboard, FaGlobe, FaRightFromBracket, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./AdminLayout.css";

const NAV_ITEMS = [
  { path: "/admin/dashboard", icon: <FaChartPie />, label: "Dashboard" },
  { path: "/admin/movies", icon: <FaFilm />, label: "Movies" },
  { path: "/admin/theatres", icon: <FaBuilding />, label: "Theatres" },
  { path: "/admin/shows", icon: <FaChair />, label: "Shows" },
  { path: "/admin/bookings", icon: <FaTicket />, label: "Bookings" },
  { path: "/admin/users", icon: <FaUsers />, label: "Users" },
  { path: "/admin/banners", icon: <FaClapperboard />, label: "Banners/Ads" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon"><FaClapperboard /></span>
          {!collapsed && <span className="logo-text">BookMy<span className="logo-accent">Show</span></span>}
        </div>

        {!collapsed && <p className="sidebar-section-label">Main Menu</p>}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? "sidebar-link-active" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <Link to="/" className="sidebar-link" style={{ fontSize: "0.8rem" }}>
              <span className="sidebar-icon"><FaGlobe /></span>
              <span>View Site</span>
            </Link>
          )}
          <button className="sidebar-link sidebar-logout" onClick={() => { logout(); navigate("/login"); }}>
            <span className="sidebar-icon"><FaRightFromBracket /></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} id="sidebar-toggle">
            {collapsed ? <FaChevronRight size={24} /> : <FaChevronLeft size={24} />}
          </button>
          <div className="topbar-right">
            <div className="admin-user-info">
              <div className="avatar avatar-sm">{user?.name?.charAt(0)}</div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{user?.name}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--clr-accent)" }}>Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
