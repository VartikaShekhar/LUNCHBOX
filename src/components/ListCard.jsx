import React from "react";
import { Card, Badge } from "react-bootstrap";

export default function ListCard({ title, creator, restaurantCount, onClick }) {
  return (
    <Card
      className="shadow-sm mb-3 h-100"
      style={{ cursor: "pointer", transition: "transform 0.2s" }}
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <Card.Body>
        <Card.Title className="mb-2">{title}</Card.Title>
        <Card.Text className="text-muted mb-2">
          Created by <strong>{creator}</strong>
        </Card.Text>
        <Badge bg="info" className="mt-1">
          {restaurantCount} restaurants
        </Badge>
      </Card.Body>
    </Card>
  );
}