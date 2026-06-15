import React, { useEffect, useState } from "react";

import { getUserBookings, cancelBooking } from "../config/allApis";
import { FaTicket, FaFilm, FaBuilding, FaCalendar, FaClock, FaDownload, FaCalendarDay } from "react-icons/fa6";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import QRCode from "react-qr-code";
import "./MyBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = React.useCallback(() => {
    getUserBookings()
      .then((r) => setBookings(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking? Seats will be released.")) return;
    try { await cancelBooking(id); fetch(); }
    catch (err) { alert(err.response?.data?.message || "Cannot cancel"); }
  };

  const handleDownload = async (id, title) => {
    const element = document.getElementById(`ticket-${id}`);
    if (!element) return;
    
    // Temporarily make it visible to capture it properly
    element.style.top = "0";
    element.style.left = "0";
    element.style.zIndex = "-1";

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add a clean white background behind the ticket in the PDF
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, pdfWidth, pdfHeight + 20, "F");
      
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
      pdf.save(`Book_My_Show_Ticket_${title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF Generation failed", err);
    } finally {
      // Hide it again
      element.style.top = "-9999px";
      element.style.left = "-9999px";
    }
  };

  const handleAddToCalendar = (b, title) => {
    if (!b.show || !b.show.date || !b.show.time) return alert("Streaming movies are available 24/7!");

    try {
      const d = new Date(b.show.date);
      const dateStr = d.toISOString().split("T")[0].replace(/-/g, "");
      
      let [hours, minutes] = b.show.time.split(":");
      const ampm = b.show.time.match(/[a-zA-Z]+/)?.[0]?.toLowerCase();
      
      hours = parseInt(hours);
      if (ampm === "pm" && hours < 12) hours += 12;
      if (ampm === "am" && hours === 12) hours = 0;
      
      const hh = hours.toString().padStart(2, "0");
      const mm = (minutes ? parseInt(minutes) : 0).toString().padStart(2, "0");
      
      const startTime = dateStr + "T" + hh + mm + "00";
      
      // Assume 3 hours duration
      const endHh = (hours + 3).toString().padStart(2, "0");
      const endTime = dateStr + "T" + endHh + mm + "00";

      const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:🎬 ${title}\nDESCRIPTION:Booking ID: ${b.bookingId}\\nSeats: ${b.seats?.map(s => s.seatNumber).join(", ")}\nLOCATION:${b.show.theatre?.name}, ${b.show.theatre?.location}\nDTSTART:${startTime}\nDTEND:${endTime}\nEND:VEVENT\nEND:VCALENDAR`;

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `Book_My_Show_${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Could not generate calendar invite.");
    }
  };

  if (loading) return <div className="page-loader" style={{ paddingTop: "80px" }}><div className="spinner" /></div>;

  return (
    <div className="my-bookings-page page-wrapper">
      <div className="container">
        <div className="mb-header">
          <h1><FaTicket style={{ verticalAlign: "middle", marginRight: "8px" }} /> My Bookings</h1>
          <p className="text-muted">{bookings.length} booking(s)</p>
        </div>

        {bookings.length === 0 ? (
          <div className="mb-empty">
            <div style={{ fontSize: "4rem", marginBottom: 16, color: "var(--clr-text-muted)" }}><FaFilm /></div>
            <h3>No Bookings Yet</h3>
            <p>Your booking history will appear here.</p>
          </div>
        ) : (
          <div className="mb-list">
            {bookings.map((b) => {
              const title = b.show?.movie?.title || b.item?.title;
              const isEvent = b.show?.movie?.itemType === "event" || b.item?.itemType === "event";
              const poster = isEvent ? (b.show?.movie?.backdrop || b.show?.movie?.poster || b.item?.backdrop || b.item?.poster) : (b.show?.movie?.poster || b.item?.poster);
              const isPremiere = !b.show;

              return (
                <div key={b._id} className={`mb-card glass ${b.status === "cancelled" ? "mb-cancelled" : ""} ${isEvent ? "mb-card-event" : ""}`}>
                  <img src={poster} alt={title} className="mb-poster" />
                  <div className="mb-info">
                    <div className="mb-top">
                      <h3 className="mb-title">{title}</h3>
                      <span className={`badge ${b.status === "confirmed" ? "badge-success" : b.status === "cancelled" ? "badge-error" : "badge-warning"}`}>
                        {b.status}
                      </span>
                    </div>

                    <p className="mb-theatre">
                      {isPremiere ? <><FaFilm style={{ verticalAlign: "middle" }}/> Lifetime Rental (Stream)</> : <><FaBuilding style={{ verticalAlign: "middle" }}/> {b.show?.theatre?.name} · {b.show?.theatre?.location}</>}
                    </p>
                    <p className="mb-datetime">
                      <FaCalendar style={{ verticalAlign: "middle" }}/> {b.show?.date ? new Date(b.show.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : new Date(b.createdAt).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      {b.show?.time ? <><span style={{ margin: "0 8px" }}>·</span><FaClock style={{ verticalAlign: "middle" }}/> {b.show.time}</> : ""}
                    </p>

                    {!isPremiere && (
                      <div className="mb-seats">
                        {b.seats?.map((s) => (
                          <span key={s.seatNumber} className={`seat-tag ${s.type}`}>{s.seatNumber}</span>
                        ))}
                      </div>
                    )}

                    <div className="mb-footer">
                      <div style={{ width: "100%" }}>
                        <p style={{ margin: "4px 0", color: "var(--clr-text)" }}><strong>Booking ID:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{b.bookingId}</span></p>
                        {b.foodItems && b.foodItems.length > 0 && (
                          <p style={{ margin: "4px 0" }}>
                            <strong>Food:</strong> {b.foodItems.map(f => `${f.quantity}x ${f.name}`).join(", ")}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: "right", minWidth: "100px" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>Total Paid</p>
                        <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--clr-success)" }}>₹{b.grandTotal?.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    {b.status === "confirmed" && (
                      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                        <button className="btn btn-sm" style={{ flex: 1, background: "rgba(45,196,146,0.1)", color: "var(--clr-success)", border: "1px solid rgba(45,196,146,0.3)", justifyContent: "center" }} onClick={() => handleDownload(b._id, title)}>
                          <FaDownload style={{ fontSize: "1.2rem", marginRight: "4px" }} /> Save PDF
                        </button>
                        {!isPremiere && (
                          <button className="btn btn-sm" style={{ flex: 1, background: "rgba(59,130,246,0.1)", color: "var(--clr-primary)", border: "1px solid rgba(59,130,246,0.3)", justifyContent: "center" }} onClick={() => handleAddToCalendar(b, title)}>
                            <FaCalendarDay style={{ fontSize: "1.1rem", marginRight: "4px" }} /> Calendar
                          </button>
                        )}
                        <button className="btn btn-sm" style={{ flex: 1, background: "rgba(239,68,68,0.1)", color: "var(--clr-error)", border: "1px solid rgba(239,68,68,0.3)", justifyContent: "center" }} onClick={() => handleCancel(b._id)} id={`cancel-booking-${b._id}`}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tear-away QR Section */}
                  <div className="mb-qr-section">
                    <div className="mb-qr-cutout"></div>
                    <div className="mb-qr-container">
                      <QRCode value={b.bookingId || b._id} size={90} />
                      <p className="mb-qr-text">Scan at entry</p>
                    </div>
                  </div>

                  {/* Hidden PDF Ticket Template */}
                  <div id={`ticket-${b._id}`} style={{ position: "absolute", top: "-9999px", left: "-9999px", width: "400px", padding: "30px", background: "#ffffff", color: "#000000", fontFamily: "sans-serif", borderRadius: "12px", border: "1px solid #e0e0e0" }}>
                    <div style={{ textAlign: "center", borderBottom: "2px dashed #cccccc", paddingBottom: "15px", marginBottom: "20px" }}>
                      <h1 style={{ margin: 0, color: "#E50914", fontSize: "28px", letterSpacing: "2px" }}>Book My Show</h1>
                      <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666666", textTransform: "uppercase", letterSpacing: "4px" }}>Admit One</p>
                    </div>
                    
                    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                      <img src={poster} alt="poster" style={{ width: "120px", height: "180px", objectFit: "cover", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} crossOrigin="anonymous" />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h2 style={{ margin: "0 0 10px 0", fontSize: "22px", lineHeight: "1.2" }}>{title}</h2>
                        <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#444" }}><strong>Theatre:</strong> {isPremiere ? "Lifetime Streaming" : b.show?.theatre?.name}</p>
                        <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#444" }}><strong>Date:</strong> {b.show?.date ? new Date(b.show.date).toLocaleDateString() : new Date(b.createdAt).toLocaleDateString()}</p>
                        <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#444" }}><strong>Time:</strong> {isPremiere ? "24/7 Access" : b.show?.time}</p>
                        
                        {!isPremiere && (
                          <div>
                            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#444" }}><strong>Seats:</strong></p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {b.seats?.map(s => <span key={s.seatNumber} style={{ padding: "4px 8px", background: "#f0f0f0", border: "1px solid #ccc", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>{s.seatNumber}</span>)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: "center", borderTop: "2px dashed #cccccc", paddingTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ padding: "10px", background: "#fff", border: "1px solid #eee", borderRadius: "8px", display: "inline-block" }}>
                        <QRCode value={b.bookingId || b._id} size={120} />
                      </div>
                      <p style={{ margin: "10px 0 0 0", fontSize: "14px", fontFamily: "monospace", letterSpacing: "1px", color: "#333" }}>{b.bookingId}</p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#888" }}>Please present this QR code at the entrance</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
