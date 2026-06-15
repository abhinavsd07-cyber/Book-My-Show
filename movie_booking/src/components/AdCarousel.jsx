import React, { useState, useEffect, useRef } from "react";
import "./AdCarousel.css";

export default function AdCarousel({ slides, height, className = "", autoPlayInterval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timerRef.current);
  }, [nextSlide, autoPlayInterval]);

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className={`ad-carousel ${className}`} 
      style={height ? { height: `clamp(200px, 45vw, ${height})` } : {}}
    >
      <div 
        className="ad-carousel-inner" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div 
            key={i} 
            className="ad-carousel-slide" 
            onClick={() => s.link && window.open(s.link, "_blank")}
            style={{ cursor: s.link ? "pointer" : "default" }}
          >
             <img src={s.bg} alt={`Ad ${i}`} className="ad-carousel-img" />
          </div>
        ))}
      </div>
      
      {slides.length > 1 && (
        <>
          <div className="ad-carousel-controls">
            <button className="ad-carousel-btn left" onClick={prevSlide}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="ad-carousel-btn right" onClick={nextSlide}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="ad-carousel-dots">
            {slides.map((_, i) => (
              <button 
                key={i} 
                className={`dot ${i === currentIndex ? "active" : ""}`} 
                onClick={() => setCurrentIndex(i)} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
