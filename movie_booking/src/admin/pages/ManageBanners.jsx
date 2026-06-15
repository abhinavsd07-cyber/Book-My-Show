import React, { useState, useEffect } from "react";

export default function ManageBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("hero");
  const [targetLink, setTargetLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { getAllAdminBanners } = await import("../../config/allApis");
      const res = await getAllAdminBanners();
      setBanners(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!editId && !file) return alert("Please select an image file");
    
    setUploading(true);
    try {
      const { uploadImage, createBanner, updateBanner } = await import("../../config/allApis");
      
      let imageUrl;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const uploadRes = await uploadImage(formData);
        imageUrl = uploadRes.data.url;
      }

      if (editId) {
        await updateBanner(editId, { imageUrl, type, targetLink });
        alert("Banner updated successfully!");
      } else {
        await createBanner({ imageUrl, type, targetLink });
        alert("Banner uploaded successfully!");
      }
      
      setFile(null);
      setTargetLink("");
      setEditId(null);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (b) => {
    setEditId(b._id);
    setType(b.type);
    setTargetLink(b.targetLink || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFile(null);
    setType("hero");
    setTargetLink("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      const { deleteBanner } = await import("../../config/allApis");
      await deleteBanner(id);
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h2>Manage Ad Carousels & Event Categories</h2>
          <p className="text-muted">Upload homepage hero banners and square Event Category cards.</p>
        </div>
      </div>
      
      <div className="admin-table-wrap mb-8" style={{ maxWidth: "600px", padding: "24px" }}>
        <h3 className="table-title mb-4">{editId ? "Edit Banner" : "Upload New Banner"}</h3>
        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group">
            <label className="form-label">Upload Image (AWS S3) {editId && "(Leave empty to keep current)"}</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Banner Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
              <option value="hero">Hero (Top Carousel)</option>
              <option value="middle">Event Category Cards (Square)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Target Link (Optional)</label>
            <input type="text" placeholder="/movie/123" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} className="form-input" />
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Saving..." : editId ? "Update Banner" : "Upload Banner"}
            </button>
            {editId && (
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-wrap">
        <div className="table-header">
          <h3 className="table-title">Current Active Banners</h3>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>TYPE</th>
                <th>LINK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img src={b.imageUrl} alt="Banner" style={{ width: "120px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                  </td>
                  <td>
                    <span className={`badge ${b.type === 'hero' ? 'badge-accent' : 'badge-success'}`}>{b.type}</span>
                  </td>
                  <td>{b.targetLink || "-"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleEdit(b)} className="btn btn-sm btn-outline" style={{ color: "var(--clr-primary)", borderColor: "var(--clr-primary)" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(b._id)} className="btn btn-sm btn-outline" style={{ color: "var(--clr-error)", borderColor: "var(--clr-error)" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "var(--clr-text-muted)" }}>
                    No banners found. Upload one above!
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
