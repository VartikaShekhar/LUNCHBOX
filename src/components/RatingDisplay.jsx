import React from "react";

export default function RatingDisplay({ rating, maxRating = 5 }) {
  const stars = "⭐".repeat(Math.round(rating));
  
  return (
    <span className="rating-display">
      {stars} <strong>{rating}</strong>/{maxRating}
    </span>
  );
}

