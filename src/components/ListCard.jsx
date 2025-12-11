import React from "react";
import { Card, Badge } from "react-bootstrap";

export default function ListCard({ title, creator, restaurantCount, onClick }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className="shadow-sm mb-3 h-100"
      style={{ cursor: "pointer", transition: "transform 0.2s", color: "black" }}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View ${title} list created by ${creator} with ${restaurantCount} restaurants`}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <Card.Body>
        <Card.Title className="mb-2">{title}</Card.Title>
        <Card.Text className="text-muted mb-2">
          Created by <strong>{creator}</strong>
        </Card.Text>

        <Badge
          bg="none"
          className="mt-1"
          style={{
            fontSize: "0.875rem",
            backgroundColor: "#E34234",
            color: "white"
          }}
        >
          {restaurantCount} {restaurantCount === 1 ? 'restaurant' : 'restaurants'}
        </Badge>

      </Card.Body>
    </Card>
  );
}