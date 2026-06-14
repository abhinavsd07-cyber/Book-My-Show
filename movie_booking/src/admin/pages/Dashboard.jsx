import React, { useEffect, useState } from "react";
import { getDashboardStats, getRevenueByMonth, getAllBookingsAdmin } from "../../config/allApis";
import { 
  FaClapperboard, 
  FaBuilding, 
  FaTicket, 
  FaIndianRupeeSign, 
  FaUsers, 
  FaChair, 
  FaArrowTrendUp, 
  FaArrowRotateRight,
  FaCalendarDay,
  FaArrowTrendDown,
  FaWallet
} from "react-icons/fa6";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import "../AdminLayout.css";
import "./Dashboard.css";

const STATUS_COLORS = {
  'Confirmed': '#10B981',
  'Cancelled': '#EF4444',
  'Pending': '#F5A623'
};

// Premium custom tooltip for the Revenue Area Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip-premium">
        <p className="custom-tooltip-title">{label}</p>
        <p className="custom-tooltip-value">
          <span style={{ color: '#F84464', marginRight: 6 }}>●</span>
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

// Premium custom tooltip for the Status Donut Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-tooltip-premium">
        <p className="custom-tooltip-title" style={{ color: STATUS_COLORS[data.name] }}>{data.name}</p>
        <p className="custom-tooltip-value">
          {data.value} bookings
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setRefreshing(true);
    Promise.all([getDashboardStats(), getRevenueByMonth(), getAllBookingsAdmin()])
      .then(([s, r, b]) => {
        setStats(s.data.data);
        
        // Format revenue for chart
        const formattedRevenue = r.data.data.map(item => ({
          ...item,
          monthName: item.month,
          revenue: item.revenue
        }));
        setRevenue(formattedRevenue);
        
        setRecentBookings(b.data.data.slice(0, 8));

        // Process status data for PieChart
        const confirmed = b.data.data.filter(x => x.status === 'confirmed').length;
        const cancelled = b.data.data.filter(x => x.status === 'cancelled').length;
        const pending = b.data.data.filter(x => x.status === 'pending').length;
        
        setStatusData([
          { name: 'Confirmed', value: confirmed },
          { name: 'Cancelled', value: cancelled },
          { name: 'Pending', value: pending }
        ].filter(x => x.value > 0));
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const statCards = [
    { 
      label: "Total Revenue", 
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`, 
      icon: <FaIndianRupeeSign />, 
      cls: "card-revenue", 
      iconCls: "icon-revenue" 
    },
    { 
      label: "Total Bookings", 
      value: stats?.totalBookings || 0, 
      icon: <FaTicket />, 
      cls: "card-bookings", 
      iconCls: "icon-bookings" 
    },
    { 
      label: "Total Users", 
      value: stats?.totalUsers || 0, 
      icon: <FaUsers />, 
      cls: "card-users", 
      iconCls: "icon-users" 
    },
    { 
      label: "Total Movies", 
      value: stats?.totalMovies || 0, 
      icon: <FaClapperboard />, 
      cls: "card-movies", 
      iconCls: "icon-movies" 
    },
    { 
      label: "Total Theatres", 
      value: stats?.totalTheatres || 0, 
      icon: <FaBuilding />, 
      cls: "card-theatres", 
      iconCls: "icon-theatres" 
    },
    { 
      label: "Active Shows", 
      value: stats?.totalShows || 0, 
      icon: <FaChair />, 
      cls: "card-shows", 
      iconCls: "icon-shows" 
    },
  ];

  const totalBookingsCount = statusData.reduce((sum, item) => sum + item.value, 0);
  const formattedDate = new Date().toLocaleDateString("en-IN", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-sub">Monitor booking trends, ticket sales, revenue metrics and venue logs.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="header-time-pill">
            <FaCalendarDay size={16} />
            <span>{formattedDate}</span>
          </div>
          <button 
            className="btn btn-outline btn-sm" 
            onClick={fetchData} 
            disabled={refreshing}
            style={{ borderRadius: "var(--radius-full)", padding: "8px 16px", display: "flex", gap: "6px" }}
          >
            <FaArrowRotateRight className={refreshing ? "spin-animation" : ""} size={16} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid-revamped">
        {statCards.map((c) => (
          <div key={c.label} className={`stat-card-premium ${c.cls}`}>
            <div className={`icon-wrapper-premium ${c.iconCls}`}>{c.icon}</div>
            <div className="stat-info">
              <span className="stat-value-premium">{c.value}</span>
              <span className="stat-label-premium">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights Row */}
      <div className="insights-row">
        <div className="insight-pill">
          <div className="insight-pill-icon"><FaWallet /></div>
          <div className="insight-pill-text">
            <h5>Average Transaction Value</h5>
            <p>₹{stats?.totalBookings ? Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString("en-IN") : 0}</p>
          </div>
        </div>
        <div className="insight-pill">
          <div className="insight-pill-icon"><FaArrowTrendUp /></div>
          <div className="insight-pill-text">
            <h5>System Health</h5>
            <p style={{ color: "#10B981" }}>Healthy (99.9%)</p>
          </div>
        </div>
        <div className="insight-pill">
          <div className="insight-pill-icon"><FaUsers /></div>
          <div className="insight-pill-text">
            <h5>User to Booking Ratio</h5>
            <p>{stats?.totalUsers ? (stats.totalBookings / stats.totalUsers).toFixed(1) : 0} bookings/user</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid-revamped">
        {/* Revenue Area Chart */}
        <div className="chart-card-premium">
          <h3 className="chart-card-title">
            <FaArrowTrendUp size={20} />
            <span>Monthly Revenue Trends</span>
          </h3>
          <div className="chart-container-wrap" style={{ height: 320 }}>
            {revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F84464" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F84464" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(224, 224, 224, 0.3)" />
                  <XAxis 
                    dataKey="monthName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--clr-text-muted)', fontWeight: 600 }} 
                    dy={12} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'var(--clr-text-muted)', fontWeight: 600 }} 
                    tickFormatter={(val) => val >= 1000 ? `₹${(val/1000).toFixed(0)}k` : `₹${val}`}
                    dx={-12}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(248, 68, 100, 0.4)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#F84464" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    style={{ filter: "drop-shadow(0 6px 8px rgba(248, 68, 100, 0.2))" }}
                    dot={{ r: 5, fill: '#F84464', strokeWidth: 3, stroke: 'var(--clr-surface)' }} 
                    activeDot={{ r: 8, fill: '#F84464', strokeWidth: 3, stroke: 'var(--clr-surface)', style: { filter: "drop-shadow(0 4px 6px rgba(248, 68, 100, 0.5))" } }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-text-muted)' }}>
                No revenue records found
              </div>
            )}
          </div>
        </div>

        {/* Status Donut Chart */}
        <div className="chart-card-premium">
          <h3 className="chart-card-title">
            <FaTicket size={20} />
            <span>Bookings by Status</span>
          </h3>
          <div className="chart-container-wrap" style={{ height: 320 }}>
            {statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="45%"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={6}
                      cornerRadius={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} style={{ filter: `drop-shadow(0 4px 6px ${STATUS_COLORS[entry.name]}40)` }} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center-label">
                  <span className="donut-center-num">{totalBookingsCount}</span>
                  <span className="donut-center-text">Bookings</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-text-muted)' }}>
                No booking status data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bookings-card-premium">
        <div className="bookings-card-header">
          <h3 className="bookings-card-title">
            <FaTicket size={20} />
            <span>Recent Bookings</span>
          </h3>
        </div>
        <div className="bookings-table-wrapper">
          <table className="bookings-table-premium">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User Details</th>
                <th>Movie</th>
                <th>Theatre</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id}>
                  <td><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{b.bookingId}</span></td>
                  <td>
                    <div className="user-details-flex">
                      <div className="user-avatar-premium">
                        {b.user?.name ? b.user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{b.user?.name || "Guest User"}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{b.user?.email || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{b.show?.movie?.title || "N/A"}</td>
                  <td>{b.show?.theatre?.name || "N/A"}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: "var(--clr-surface-2)", color: "var(--clr-text)" }}>
                      {b.seats?.length || 0} Seat(s)
                    </span>
                  </td>
                  <td style={{ fontWeight: 750, color: "var(--clr-text)" }}>
                    ₹{(b.grandTotal || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={`badge-status badge-status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "var(--clr-text-muted)", padding: "48px" }}>
                    No bookings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
