import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/theatres/${movie.id}`);
  };

  return (
    <Card className="movie-card shadow-sm">
  <Card.Img
    variant="top"
    src={movie.poster}
    className="movie-card-img"
    alt={movie.title}
  />

  <Card.Body>
    <Card.Title className="movie-card-title">{movie.title}</Card.Title>

    <Card.Text className="movie-card-text">
      {movie.genre} | ⭐ {movie.rating}
    </Card.Text>

    <Button className="btn-danger" onClick={handleBookNow}>
      Book Now
    </Button>
  </Card.Body>
</Card>

  );
}
