import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { Container, Button } from "react-bootstrap";
import "./Booking.css";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [time, setTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    api.get(`/movies/${id}`).then((res) => setMovie(res.data));

    if (location.state) {
      setTheatre(location.state.theatre);
      setTime(location.state.time);
      setSelectedSeats(location.state.seats);
    }
  }, [id, location.state]);

  if (!movie || !theatre)
    return <div className="loading">Loading booking summary...</div>;

  const seatPrice = 200;
  const totalPrice = seatPrice * selectedSeats.length;

  const handleConfirm = () => {
    api.post("/bookings", {
      movieId: movie.id,
      theatreId: theatre.id,
      time: time,
      seats: selectedSeats,
      movieTitle: movie.title,
      theatreName: theatre.name,
      total: totalPrice
    })
    .then(() => {
      alert("Booking Successful!");
      navigate("/");
    })
    .catch((err) => {
      console.error("Booking Error:", err);
      alert("Booking failed. Check API connection.");
    });
  };

  return (
    <div className="booking-wrapper">
      <Container className="booking-container">

        <div className="booking-left">
          <h2 className="page-title">Booking Summary</h2>

          <div className="movie-card">
            <h3 className="movie-title">{movie.title}</h3>

            <div className="details">
              <p><strong>Theatre:</strong> {theatre.name}</p>
              <p><strong>Location:</strong> {theatre.location}</p>
              <p><strong>Show Time:</strong> {time}</p>
              <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
            </div>
          </div>
        </div>

        <div className="summary-box">
          <h4>Payment Details</h4>

          <div className="summary-item">
            <span>Ticket Price</span>
            <span>₹{seatPrice} x {selectedSeats.length}</span>
          </div>

          <div className="summary-item total">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>

          <Button className="confirm-btn" onClick={handleConfirm}>
            Confirm Booking
          </Button>
        </div>

      </Container>
    </div>
  );
}
