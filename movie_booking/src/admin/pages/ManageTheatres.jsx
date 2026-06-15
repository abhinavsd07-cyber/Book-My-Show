import React, { useEffect, useState } from "react";
import { getAllTheatres, createTheatre, updateTheatre, deleteTheatre } from "../../config/allApis";
import { FaBuilding, FaLocationDot } from "react-icons/fa6";
import "../AdminLayout.css";

const EMPTY = { name: "", location: "", address: "", phone: "", totalScreens: 1, amenities: "" };

export default function ManageTheatres() {
  const [theatres, setTheatres] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => getAllTheatres().then((r) => setTheatres(r.data.data)).catch(console.error);
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal("add"); };
  const openEdit = (t) => { setForm({ ...t, amenities: t.amenities?.join(", ") || "" }); setEditId(t._id); setModal("edit"); };
  const close = () => setModal(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean) };
      if (editId) await updateTheatre(editId, payload);
      else await createTheatre(payload);
      fetch(); close();
    } catch (err) { alert(err.response?.data?.message || "Error"); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await deleteTheatre(id); fetch();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title"><FaBuilding style={{ verticalAlign: "middle", marginRight: 8 }} /> Manage Theatres</h1>
          <p className="admin-page-sub">{theatres.length} theatres registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-theatre-btn">+ Add Theatre</button>
      </div>

      <div className="admin-table-wrap">
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Theatre</th><th>Location</th><th>Phone</th><th>Screens</th><th>Amenities</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {theatres.map((t) => (
                <tr key={t._id}>
                  <td><p style={{ fontWeight: 600 }}>{t.name}</p><p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{t.address}</p></td>
                  <td><FaLocationDot style={{ verticalAlign: 'text-bottom', color: 'var(--clr-accent)' }} /> {t.location}</td>
                  <td>{t.phone || "—"}</td>
                  <td>{t.totalScreens}</td>
                  <td>{t.amenities?.map((a) => <span key={a} className="ts-amenity-tag" style={{ marginRight: 4 }}>{a}</span>)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(t)} id={`edit-theatre-${t._id}`}>Edit</button>
                      <button className="btn btn-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--clr-error)", border: "1px solid rgba(239,68,68,0.3)" }} onClick={() => handleDelete(t._id, t.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {theatres.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", color: "var(--clr-text-muted)", padding: "40px" }}>No theatres yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal-box">
            <h3 className="modal-title">{modal === "add" ? "Add Theatre" : "Edit Theatre"}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label className="form-label">Theatre Name *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="admin-grid-2">
                <div className="form-group"><label className="form-label">City / Location *</label><input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Full Address *</label><input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
              <div className="admin-grid-2">
                <div className="form-group"><label className="form-label">Total Screens</label><input className="form-input" type="number" min={1} value={form.totalScreens} onChange={(e) => setForm({ ...form, totalScreens: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Amenities (comma-separated)</label><input className="form-input" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Dolby, IMAX, Parking" /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting} id="save-theatre-btn">{submitting ? "Saving..." : "Save Theatre"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
