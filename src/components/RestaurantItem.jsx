import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import Tag from "./Tag";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80";

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
};

export default function RestaurantItem({ restaurant, onClick, onTagClick }) {
  const { name, rating, tags = [], image, imageAlt, image_alt } = restaurant;
  const altText = imageAlt || image_alt;
  const normalizedTags = normalizeTags(tags);
  const imageSrc = image || FALLBACK_IMAGE;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className="shadow-sm mb-3 restaurant-card"
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
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <Image
              src={imageSrc}
              alt={altText || `Photo of ${name}`}
              rounded
              fluid
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />
          </Col>

          {/* Name, rating, tags */}
          <Col xs={12} md={6}>
            <Card.Title className="mb-1">{name}</Card.Title>
            {rating !== undefined && (
              <Card.Text className="mb-1">
                ⭐ <strong>{rating}</strong>/5
              </Card.Text>
            )}
            <div onClick={(e) => e.stopPropagation()}>
              {normalizedTags.map((tag) => (
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
