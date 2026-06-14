import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNowShowing, getPremieres, getEvents, getBanners } from "../config/allApis";
import { useLocationContext } from "../context/LocationContext";
import SEO from "../components/SEO";
import "./Home.css";

import AdCarousel from "../components/AdCarousel";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [premieres, setPremieres] = useState([]);
  const [events, setEvents] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [middleBanners, setMiddleBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { location } = useLocationContext();

  useEffect(() => {
    setLoading(true);
    Promise.all([getNowShowing({ location }), getPremieres(), getEvents({ location }), getBanners()])
      .then(([m, p, e, b]) => { 
        setMovies(m.data.data); 
        setPremieres(p.data.data); 
        setEvents(e.data.data); 
        
        const allBanners = b.data.data || [];
        setHeroBanners(allBanners.filter(x => x.type === 'hero').map(x => ({ bg: x.imageUrl, link: x.targetLink })));
        setMiddleBanners(allBanners.filter(x => x.type === 'middle').map(x => ({ bg: x.imageUrl, link: x.targetLink })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <div className="home-page page-wrapper">
      <SEO />
      {/* ── Top Hero Banner Carousel ── */}
      {heroBanners.length > 0 && (
        <section className="mb-8" style={{ background: "var(--clr-bg)" }}>
          <div className="container" style={{ paddingTop: "20px" }}>
            <AdCarousel slides={heroBanners} className="hero-carousel-override" />
          </div>
        </section>
      )}

      <div className="container">
        {/* ── RECOMMENDED MOVIES ── */}
        <section id="now-showing" className="section-movies">
          <div className="section-header">
            <h2 className="section-title">Recommended Movies</h2>
            <button className="see-all-btn">See All &rsaquo;</button>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : (
            <div className="movie-grid h-scroll">
              {movies.length > 0 ? movies.map((m) => (
                <div key={m._id} className="bms-movie-card" onClick={() => navigate(`/movie/${m._id}`)}>
                  <div className="poster-wrapper">
                    <img src={m.poster} alt={m.title} className="poster-img" loading="lazy" />
                    {m.rating > 0 && (
                      <div className="rating-bar">
                        ⭐ {m.rating.toFixed(1)} / 10 <span className="votes">50K+ Votes</span>
                      </div>
                    )}
                  </div>
                  <h4 className="title">{m.title}</h4>
                  <p className="genre">{m.genre?.join("/")}</p>
                </div>
              )) : (
                <div className="empty-state">
                  <p>No movies currently playing in your region.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── MIDDLE AD CAROUSEL ── */}
        {middleBanners.length > 0 && (
          <section className="live-events-banner mt-8">
            <AdCarousel slides={middleBanners} height="120px" autoPlayInterval={5000} />
          </section>
        )}

        {/* ── PREMIERES ── */}
        {premieres.length > 0 && (
          <section id="premieres" className="section-movies mt-8" style={{ background: "#2B3149", padding: "40px", borderRadius: "8px", color: "white" }}>
            <div className="section-header">
              <h2 className="section-title" style={{ color: "white" }}>Premieres</h2>
              <p className="section-subtitle" style={{ color: "#aaa" }}>Brand new releases every Friday</p>
            </div>
            <div className="movie-grid h-scroll">
              {premieres.map((m) => (
                <div key={m._id} className="bms-movie-card" onClick={() => navigate(`/movie/${m._id}`)}>
                  <div className="poster-wrapper">
                    <img src={m.poster} alt={m.title} className="poster-img" loading="lazy" />
                    <div className="premiere-badge">PREMIERE</div>
                  </div>
                  <h4 className="title" style={{ color: "white" }}>{m.title}</h4>
                  <p className="genre" style={{ color: "#aaa" }}>{m.language?.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EVENTS ── */}
        {events.length > 0 && (
          <section id="events" className="section-movies mt-8">
            <div className="section-header">
              <h2 className="section-title">The Best of Live Events</h2>
              <button className="see-all-btn">See All &rsaquo;</button>
            </div>
            <div className="movie-grid h-scroll">
              {events.map((m) => (
                <div key={m._id} className="bms-movie-card" onClick={() => navigate(`/movie/${m._id}`)}>
                  <div className="poster-wrapper">
                    <img src={m.poster} alt={m.title} className="poster-img" loading="lazy" />
                  </div>
                  <h4 className="title">{m.title}</h4>
                  <p className="genre">{m.genre?.join("/")}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
