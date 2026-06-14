import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { FaCircleCheck, FaFilm, FaDownload, FaTicket, FaHouse, FaCalendar } from "react-icons/fa6";
import { QRCodeCanvas } from 'qrcode.react';
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);
  const booking = location.state?.booking;

  if (!booking) { navigate("/"); return null; }

  const show = booking.show;
  const movie = show?.movie || booking.item;
  const theatre = show?.theatre;
  const isPremiere = !show;

  const downloadTicket = async () => {
    const el = ticketRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#12121E", useCORS: true });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a5");
    const w = pdf.internal.pageSize.getWidth() - 20;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 10, 10, w, h);
    pdf.save(`BookMyShow_${booking.bookingId}.pdf`);
  };

  const addToCalendar = () => {
    if (!show || !movie) return;
    
    // Parse Date and Time safely handling both 24-hour and AM/PM formats
    const dateObj = new Date(show.date);
    const [timePart, modifier] = show.time.split(" ");
    let [hours, minutes] = timePart.split(":");
    let h = parseInt(hours, 10);
    if (modifier && modifier.toUpperCase() === "PM" && h < 12) h += 12;
    if (modifier && modifier.toUpperCase() === "AM" && h === 12) h = 0;
    dateObj.setHours(h, parseInt(minutes, 10), 0);
    
    const endDateObj = new Date(dateObj.getTime() + (2.5 * 60 * 60 * 1000)); // Assume 2.5 hours duration
    
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const startDateStr = formatDate(dateObj);
    const endDateStr = formatDate(endDateObj);
    const nowStr = formatDate(new Date());

    const seatsStr = booking.seats?.map(s => s.seatNumber).join(", ") || "";

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookMyShow//BookMyShow Calendar//EN
BEGIN:VEVENT
UID:${booking.bookingId}@bookmyshow.com
DTSTAMP:${nowStr}
DTSTART:${startDateStr}
DTEND:${endDateStr}
SUMMARY:BookMyShow: ${movie.title}
DESCRIPTION:Booking ID: ${booking.bookingId}\\nSeats: ${seatsStr}\\nTheatre: ${theatre?.name}\\nScreen: ${show?.screen || '1'}\\nAmount Paid: Rs. ${booking.grandTotal}
LOCATION:${theatre?.name}, ${theatre?.location || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `BookMyShow_${booking.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFromHistory = location.state?.fromHistory;

  return (
    <div className="success-page page-wrapper">
      <div className="success-container">
        {/* Success Header */}
        <div className="success-header animate-slide-up">
          <div className="success-icon"><FaCircleCheck color="#2DC492" size={64} /></div>
          <h1>{isFromHistory ? "Your Ticket" : "Booking Confirmed!"}</h1>
          <p>{isFromHistory ? "Here is your ticket." : "Your tickets are ready. Enjoy the show!"} <FaFilm style={{ verticalAlign: "middle" }}/></p>
          <div className="booking-id-badge">Booking ID: <strong>{booking.bookingId}</strong></div>
        </div>

        {/* Ticket */}
        <div className="ticket-wrap animate-slide-up" style={{ animationDelay: "0.1s" }} ref={ticketRef}>
          <div className="ticket">
            {/* Ticket Left (Movie Info) */}
            <div className="ticket-left">
              <div className="ticket-logo"><FaFilm style={{ verticalAlign: "middle" }}/> BookMyShow</div>

              <img src={movie?.poster} alt={movie?.title} className="ticket-poster" />

              <div className="ticket-movie-info">
                <h2 className="ticket-movie-name">{movie?.title}</h2>
                <div className="ticket-badges">
                  {movie?.genre?.slice(0, 2).map((g) => (
                    <span key={g} className="badge badge-accent" style={{ fontSize: "0.65rem" }}>{g}</span>
                  ))}
                  {show?.format && <span className="badge badge-platinum" style={{ fontSize: "0.65rem" }}>{show.format}</span>}
                </div>
              </div>
            </div>

            {/* Ticket Perforation */}
            <div className="ticket-perf">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="perf-dot" />
              ))}
            </div>

            {/* Ticket Right (Details) */}
            <div className="ticket-right">
              {isPremiere ? (
                <>
                  <div className="ticket-detail-row">
                    <div className="ticket-detail">
                      <span className="td-label">Access</span>
                      <span className="td-value">Lifetime Rental</span>
                    </div>
                  </div>
                  <div className="ticket-detail-row">
                    <div className="ticket-detail">
                      <span className="td-label">Date Purchased</span>
                      <span className="td-value">{new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="ticket-detail-row">
                    <div className="ticket-detail">
                      <span className="td-label">Theatre</span>
                      <span className="td-value">{theatre?.name}</span>
                    </div>
                    <div className="ticket-detail">
                      <span className="td-label">Screen</span>
                      <span className="td-value">{show?.screen || "1"}</span>
                    </div>
                  </div>

                  <div className="ticket-detail-row">
                    <div className="ticket-detail">
                      <span className="td-label">Date</span>
                      <span className="td-value">{new Date(show?.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="ticket-detail">
                      <span className="td-label">Time</span>
                      <span className="td-value">{show?.time}</span>
                    </div>
                  </div>

                  <div className="ticket-seats-section">
                    <span className="td-label">Seats</span>
                    <div className="ticket-seat-list">
                      {booking.seats?.map((s) => (
                        <span key={s.seatNumber} className={`seat-tag ${s.type}`} style={{ fontSize: "0.75rem" }}>
                          {s.seatNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="ticket-amount">
                <span className="td-label">Amount Paid</span>
                <span className="ticket-total">₹{booking.grandTotal}</span>
              </div>

              {/* QR Code */}
              <div className="ticket-qr" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <div style={{ background: "#FFF", padding: "8px", borderRadius: "8px" }}>
                  <QRCodeCanvas value={booking.bookingId} size={80} level="H" />
                </div>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{booking.bookingId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="success-actions animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <button className="btn btn-primary btn-lg" onClick={downloadTicket} id="download-ticket-btn">
            <FaDownload style={{ marginRight: 8, fontSize: "1.2rem" }}/> Download Ticket PDF
          </button>
          {!isPremiere && (
            <button className="btn btn-outline btn-lg" onClick={addToCalendar} id="add-calendar-btn">
              <FaCalendar style={{ marginRight: 8, fontSize: "1.2rem" }}/> Add to Calendar
            </button>
          )}
          <button className="btn btn-outline btn-lg" onClick={() => navigate("/my-bookings")} id="my-bookings-btn">
            <FaTicket style={{ marginRight: 8, fontSize: "1.2rem" }}/> My Bookings
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate("/")} id="home-btn">
            <FaHouse style={{ marginRight: 8, fontSize: "1.2rem" }}/> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
