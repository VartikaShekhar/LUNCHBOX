import React from "react";
import { Card, Row, Col, Image, Badge } from "react-bootstrap";

export default function RestaurantItem({ restaurant, onClick }) {
  const { name, rating, tags = [] } = restaurant;

  return (
    <Card
      className="shadow-sm mb-3"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Card.Body>
        <Row className="align-items-center">
          {/* Name, rating, tags */}
          <Col xs={12} md={9}>
            <Card.Title className="mb-1">{name}</Card.Title>
            {rating !== undefined && (
              <Card.Text className="mb-1">
                ⭐ <strong>{rating}</strong>/5
              </Card.Text>
            )}
            <div>
              {tags.map((tag) => (
                <Badge key={tag} bg="secondary" className="me-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </Col>

          {/* Right side hint */}
          <Col xs={12} md={3} className="mt-2 mt-md-0 text-md-end">
            <small className="text-muted">View details →</small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
