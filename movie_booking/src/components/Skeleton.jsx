import React from "react";
import "./Skeleton.css";

export default function Skeleton({ type = "text", width, height, className = "" }) {
  const classes = `skeleton ${type} ${className}`;
  const style = { width, height };

  return <div className={classes} style={style}></div>;
}

export function MovieCardSkeleton() {
  return (
    <div className="skeleton-movie-card">
      <Skeleton type="rect" className="skeleton-poster" />
      <Skeleton type="title" width="80%" />
      <Skeleton type="text" width="60%" />
    </div>
  );
}
