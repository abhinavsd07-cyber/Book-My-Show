import React, { useState } from "react";
import "./Offers.css";

const OFFERS_DATA = [
  {
    id: 1,
    title: "RBL Bank Popcorn",
    type: "CREDIT CARD",
    validTill: "Valid till 31 Dec 2026",
    logo: "/images/offers/rblpop.jpg",
  },
  {
    id: 2,
    title: "Welcome to the RED CARPET",
    type: "CREDIT CARD",
    validTill: "Valid till 31 Mar 2026",
    logo: "/images/offers/idfcprvt.jpg",
  },
  {
    id: 3,
    title: "Play Credit Card Offer",
    type: "CREDIT CARD",
    validTill: "Valid till 31 Dec 2026",
    logo: "/images/offers/rbltrio.jpg",
  },
  {
    id: 4,
    title: "Kotak Mahindra Bank Offer",
    type: "DEBIT CARD",
    validTill: "Valid till 31 Jan 2026",
    logo: "/images/offers/kotaksup.jpg",
  },
  {
    id: 5,
    title: "AU Small Finance Bank Offer",
    type: "CREDIT CARD",
    validTill: "Valid till 31 Mar 2026",
    logo: "/images/offers/ausfbcc.jpg",
  },
  {
    id: 6,
    title: "SBI Signature Card",
    type: "CREDIT CARD",
    validTill: "Valid till 30 Jun 2026",
    logo: "/images/offers/sbisign.jpg",
  },
];

export default function Offers() {
  const [search, setSearch] = useState("");

  const filteredOffers = OFFERS_DATA.filter(offer => 
    offer.title.toLowerCase().includes(search.toLowerCase()) || 
    offer.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="offers-page">
      {/* Top Banner & Search */}
      <div className="offers-search-container">
        <div className="container">
          <div className="search-bar-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search for Offers by Name or Bank"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="offers-search-input"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs (Mock) */}
      <div className="offers-filters">
        <div className="container">
          <ul className="filters-list">
            <li className="filter-item active">All Offers</li>
            <li className="filter-item">Bank Offers</li>
            <li className="filter-item">Credit Card</li>
            <li className="filter-item">Debit Card</li>
            <li className="filter-item">Wallet</li>
          </ul>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="offers-content">
        <div className="container">
          <div className="offers-grid">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-logo-wrap">
                  <img src={offer.logo} alt={offer.title} className="offer-logo" />
                </div>
                <div className="offer-details">
                  <h3 className="offer-title">{offer.title}</h3>
                  <div className="offer-meta">
                    <span className="offer-type">{offer.type}</span>
                    <span className="offer-validity">{offer.validTill}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredOffers.length === 0 && (
            <div className="no-offers">
              <p>No offers found for "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
