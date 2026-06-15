import React from "react";
import "./GiftCards.css";

const GIFT_CARDS = [
  {
    id: 1,
    title: "Generic E-Gift Card",
    image: "/images/giftcards/generic.jpg",
  },
  {
    id: 2,
    title: "Happy Birthday",
    image: "/images/giftcards/birthday.jpg",
  },
  {
    id: 3,
    title: "Thank You",
    image: "/images/giftcards/thankyou.jpg",
  },
  {
    id: 4,
    title: "Congratulations",
    image: "/images/giftcards/congratulations.jpg",
  },
  {
    id: 5,
    title: "Anniversary",
    image: "/images/giftcards/anniversary.jpg",
  },
  {
    id: 6,
    title: "Best Wishes",
    image: "/images/giftcards/bestwishes.jpg",
  },
];

export default function GiftCards() {
  return (
    <div className="giftcards-page">
      <div className="giftcards-hero">
        <div className="container">
          <div className="hero-content">
            <h1>E-Gift Cards</h1>
            <p>Gift Entertainment. Gift Experiences.</p>
          </div>
        </div>
      </div>

      <div className="giftcards-content">
        <div className="container">
          <div className="giftcards-header">
            <h2>Pick a Card from our Collections</h2>
          </div>
          
          <div className="giftcards-grid">
            {GIFT_CARDS.map((card) => (
              <div key={card.id} className="gc-card">
                <img src={card.image} alt={card.title} className="gc-image" />
                <div className="gc-details">
                  <h3>{card.title}</h3>
                  <button className="btn-buy-gc">Buy Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
