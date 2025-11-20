import React from "react";

export default function ListCard({ title, creator, restaurantCount, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        cursor: "pointer"
      }}
    >
      <h3>{title}</h3>
      <p>Created by {creator}</p>
      <p>{restaurantCount} restaurants</p>
    </div>
  );
}