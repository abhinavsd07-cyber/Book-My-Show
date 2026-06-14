import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TheatreSelection.css";

const TheatreSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    // Get movie details
    axios.get(`https://bookmyshow-server-json.onrender.com/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));

    // Get theatres showing this movie
    axios.get(`https://bookmyshow-server-json.onrender.com`)
      .then(res => {
        // Filter theatres which have this movie
        const filtered = res.data.filter(theatre =>
          theatre.movies.some(m => m.movieId === parseInt(id))
        );
        // Map to include showtimes for this movie
        const theatresWithTimes = filtered.map(theatre => {
          const movieObj = theatre.movies.find(m => m.movieId === parseInt(id));
          return { ...theatre, showtimes: movieObj.showtimes, seats: generateSeats(40) };
        });
        setTheatres(theatresWithTimes);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <p className="message">Loading...</p>;

  // Generate seats dynamically (replace with booked info later)
  const generateSeats = (count) => {
    const seats = [];
    for (let i = 1; i <= count; i++) {
      seats.push({ id: i, booked: false });
    }
    return seats;
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  return (
    <div className="theatre-container">
      <h1>{movie.title} - Select Your Show</h1>

      <div className="theatre-list">
        {theatres.map(theatre => (
          <div key={theatre.id} className="theatre-card">
            <h3>{theatre.name}</h3>

            <div className="showtimes">
              {theatre.showtimes.map(time => (
                <button
                  key={time}
                  className={`showtime-btn ${selectedTime === time && selectedTheatre?.id === theatre.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedTheatre(theatre); setSelectedTime(time); setSelectedSeats([]); }}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTheatre?.id === theatre.id && selectedTime && (
              <div className="seats">
                {theatre.seats.map(seat => (
                  <div
                    key={seat.id}
                    className={`seat ${seat.booked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                    onClick={() => !seat.booked && toggleSeat(seat.id)}
                  >
                    {seat.id}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedSeats.length > 0 && (
        <div className="proceed-btn-container">
          <button
            onClick={() => navigate(`/payment/${movie.id}`, { state: { theatre: selectedTheatre, time: selectedTime, seats: selectedSeats } })}
            className="proceed-btn"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default TheatreSelection;
