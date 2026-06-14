import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { FaArrowTrendUp, FaTicket, FaUsers, FaIndianRupeeSign } from "react-icons/fa6";
import axios from "axios";
import "./AdminDashboard.css";

const COLORS = ['#E50914', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will use our new /api/admin/analytics endpoint.
    // Assuming admin auth is handled or bypassed for prototype.
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get((import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        // Fallback mock data if not an admin or endpoint fails
        setData({
          kpis: { totalRevenue: 125000, totalTickets: 450, totalBookings: 120, totalUsers: 85 },
          dailyRevenue: [
            { _id: "2026-06-08", revenue: 15000 },
            { _id: "2026-06-09", revenue: 22000 },
            { _id: "2026-06-10", revenue: 18000 },
            { _id: "2026-06-11", revenue: 35000 },
            { _id: "2026-06-12", revenue: 28000 },
            { _id: "2026-06-13", revenue: 42000 },
            { _id: "2026-06-14", revenue: 39000 },
          ],
          popularGenres: [
            { name: "Action", value: 400 },
            { name: "Sci-Fi", value: 300 },
            { name: "Drama", value: 200 },
            { name: "Comedy", value: 100 }
          ],
          popularMovies: [
            { name: "Inception", revenue: 50000 },
            { name: "The Dark Knight", revenue: 45000 },
            { name: "Interstellar", revenue: 30000 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="page-loader" style={{ paddingTop: "80px" }}><div className="spinner" /></div>;

  return (
    <div className="admin-dashboard-page page-wrapper">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Analytics</h1>
          <p className="text-muted">Business Performance Dashboard</p>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <div className="kpi-card glass">
            <div className="kpi-icon"><FaIndianRupeeSign /></div>
            <div className="kpi-info">
              <p>Total Revenue</p>
              <h3>₹{data.kpis.totalRevenue.toLocaleString("en-IN")}</h3>
            </div>
          </div>
          <div className="kpi-card glass">
            <div className="kpi-icon"><FaTicket /></div>
            <div className="kpi-info">
              <p>Tickets Sold</p>
              <h3>{data.kpis.totalTickets}</h3>
            </div>
          </div>
          <div className="kpi-card glass">
            <div className="kpi-icon"><FaArrowTrendUp /></div>
            <div className="kpi-info">
              <p>Total Bookings</p>
              <h3>{data.kpis.totalBookings}</h3>
            </div>
          </div>
          <div className="kpi-card glass">
            <div className="kpi-icon"><FaUsers /></div>
            <div className="kpi-info">
              <p>Active Users</p>
              <h3>{data.kpis.totalUsers}</h3>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Line Chart */}
          <div className="chart-card glass span-2">
            <h3>Revenue (Last 7 Days)</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="_id" stroke="var(--clr-text-muted)" />
                  <YAxis stroke="var(--clr-text-muted)" />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--clr-bg-alt)', borderColor: 'var(--clr-border)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#E50914" strokeWidth={3} dot={{ r: 6, fill: '#E50914' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-card glass">
            <h3>Popular Genres</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.popularGenres}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.popularGenres.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--clr-bg-alt)', borderColor: 'var(--clr-border)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {data.popularGenres.map((g, i) => (
                <div key={i} className="legend-item">
                  <span className="color-dot" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  {g.name}
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="chart-card glass span-2">
            <h3>Top Performing Movies (Revenue)</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.popularMovies} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="var(--clr-text-muted)" />
                  <YAxis dataKey="name" type="category" stroke="var(--clr-text-muted)" width={150} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--clr-bg-alt)', borderColor: 'var(--clr-border)', borderRadius: '8px' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
