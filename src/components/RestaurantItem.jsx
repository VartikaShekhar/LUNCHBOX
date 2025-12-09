import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import Tag from "./Tag";

export default function RestaurantItem({ restaurant, onClick, onTagClick }) {
  const { name, rating, tags = [], image, imageAlt, image_alt } = restaurant;
  const altText = imageAlt || image_alt;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className="shadow-sm mb-3"
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${name}${rating ? `, rated ${rating} out of 5 stars` : ''}`}
    >
      <Card.Body>
        <Row className="align-items-center">
          {/* Restaurant Image */}
          {image && (
            <Col xs={12} md={3} className="mb-3 mb-md-0">
              <Image
                src={image}
                alt={altText || `Photo of ${name}`}
                rounded
                fluid
                style={{ width: "100%", height: "120px", objectFit: "cover" }}
              />
            </Col>
          )}

          {/* Name, rating, tags */}
          <Col xs={12} md={image ? 6 : 9}>
            <Card.Title className="mb-1">{name}</Card.Title>
            {rating !== undefined && (
              <Card.Text className="mb-1">
                ⭐ <strong>{rating}</strong>/5
              </Card.Text>
            )}
            <div onClick={(e) => e.stopPropagation()}>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  onClick={onTagClick ? () => onTagClick(tag) : undefined}
                />
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
