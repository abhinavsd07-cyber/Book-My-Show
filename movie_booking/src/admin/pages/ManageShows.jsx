import React, { useEffect, useState } from "react";
import { getAllShows, createShow, deleteShow, getAllMovies, getAllTheatres } from "../../config/allApis";
import { FaChair } from "react-icons/fa6";
import "../AdminLayout.css";

const EMPTY = { movie: "", theatre: "", screen: "Screen 1", date: "", time: "", format: "2D", language: "English", goldPrice: 200, platinumPrice: 350, reclinerPrice: 500 };

export default function ManageShows() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => {
    Promise.all([getAllShows(), getAllMovies(), getAllTheatres()])
      .then(([s, m, t]) => { setShows(s.data.data); setMovies(m.data.data); setTheatres(t.data.data); })
      .catch(console.error);
  };
  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await createShow(form); fetchAll(); setModal(false); setForm(EMPTY); }
    catch (err) { alert(err.response?.data?.message || "Error"); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this show?")) return;
    await deleteShow(id); fetchAll();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title"><FaChair style={{ verticalAlign: "middle", marginRight: 8 }} /> Manage Shows</h1><p className="admin-page-sub">{shows.length} shows scheduled</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)} id="add-show-btn">+ Add Show</button>
      </div>

      <div className="admin-table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead><tr><th>Movie</th><th>Theatre</th><th>Date</th><th>Time</th><th>Format</th><th>Prices</th><th>Actions</th></tr></thead>
            <tbody>
              {shows.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={s.movie?.poster} alt="" style={{ width: 32, height: 44, objectFit: "cover", borderRadius: 4 }} />
                      <span style={{ fontWeight: 600 }}>{s.movie?.title}</span>
                    </div>
                  </td>
                  <td>{s.theatre?.name}<br /><span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{s.theatre?.location}</span></td>
                  <td>{new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td style={{ fontWeight: 600 }}>{s.time}</td>
                  <td><span className="badge badge-platinum">{s.format}</span></td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: "0.75rem" }}>
                      <span className="text-gold">G: ₹{s.seats?.gold?.price}</span>
                      <span style={{ color: "var(--clr-platinum)" }}>P: ₹{s.seats?.platinum?.price}</span>
                      <span style={{ color: "var(--clr-recliner)" }}>R: ₹{s.seats?.recliner?.price}</span>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--clr-error)", border: "1px solid rgba(239,68,68,0.3)" }} onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {shows.length === 0 && <tr><td colSpan="7" style={{ textAlign: "center", color: "var(--clr-text-muted)", padding: "40px" }}>No shows scheduled</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <h3 className="modal-title">Create New Show</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Movie *</label>
                <select className="form-input" value={form.movie} onChange={(e) => setForm({ ...form, movie: e.target.value })} required>
                  <option value="">Select Movie</option>
                  {movies.map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Theatre *</label>
                <select className="form-input" value={form.theatre} onChange={(e) => setForm({ ...form, theatre: e.target.value })} required>
                  <option value="">Select Theatre</option>
                  {theatres.map((t) => <option key={t._id} value={t._id}>{t.name} — {t.location}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group"><label className="form-label">Date *</label><input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Time *</label><input className="form-input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div className="form-group"><label className="form-label">Format</label>
                  <select className="form-input" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                    {["2D","3D","IMAX","4DX"].map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Screen</label><input className="form-input" value={form.screen} onChange={(e) => setForm({ ...form, screen: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Language</label><input className="form-input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></div>
              </div>
              <div style={{ background: "var(--clr-surface-2)", border: "1px solid var(--clr-border)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 12, color: "var(--clr-text-muted)" }}>SEAT PRICING</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div className="form-group"><label className="form-label text-gold">Gold ₹</label><input className="form-input" type="number" value={form.goldPrice} onChange={(e) => setForm({ ...form, goldPrice: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label" style={{ color: "var(--clr-platinum)" }}>Platinum ₹</label><input className="form-input" type="number" value={form.platinumPrice} onChange={(e) => setForm({ ...form, platinumPrice: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label" style={{ color: "var(--clr-recliner)" }}>Recliner ₹</label><input className="form-input" type="number" value={form.reclinerPrice} onChange={(e) => setForm({ ...form, reclinerPrice: e.target.value })} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting} id="save-show-btn">{submitting ? "Creating..." : "Create Show"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
