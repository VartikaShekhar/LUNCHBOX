import React from "react";
import { Card, Image, Button } from "react-bootstrap";
import Tag from "./Tag";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1500&q=80";

const normalizeTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
        return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    }
    return [];
};

export default function RestaurantDetailPanel({ restaurant, onTagClick }) {
    const { name, rating, tags = [], address, hours, description, image, imageAlt, image_alt, website, maps_link } = restaurant;
    const altText = imageAlt || image_alt;
    const normalizedTags = normalizeTags(tags);
    const imageSrc = image || FALLBACK_IMAGE;

    return (
        <Card className="shadow-sm mb-3">
            <Image
                src={imageSrc}
                alt={altText || `Photo of ${name}`}
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
            <Card.Body>
                <h1 className="mb-3">{name}</h1>

                {rating && (
                    <p className="mb-3">
                        <span aria-label={`Rating: ${rating} out of 5 stars`}>
                            ⭐ <strong>{rating}</strong>/5
                        </span>
                    </p>
                )}

                {normalizedTags.length > 0 && (
                    <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                        {normalizedTags.map((tag) => (
                            <Tag
                                key={tag}
                                label={tag}
                                variant="secondary"
                                onClick={onTagClick ? () => onTagClick(tag) : undefined}
                            />
                        ))}
                    </div>
                )}

                {address && (
                    <Card.Text className="mb-2">
                        <strong>📍 Address: </strong>
                        {address}
                    </Card.Text>
                )}

                {hours && (
                    <Card.Text className="mb-2">
                        <strong>🕒 Hours: </strong>
                        {hours}
                    </Card.Text>
                )}

                {(website || maps_link) && (
                    <div className="mb-3 d-flex gap-2 flex-wrap">
                        {website && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${name} website`}
                            >
                                🌐 Website
                            </Button>
                        )}
                        {maps_link && (
                            <Button
                                variant="outline-success"
                                size="sm"
                                href={maps_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${name} on Google Maps`}
                            >
                                📍 View on Maps
                            </Button>
                        )}
                    </div>
                )}

                {description && (
                    <>
                        <h2 className="h5 mt-4">About</h2>
                        <Card.Text>{description}</Card.Text>
                    </>
                )}
            </Card.Body>
        </Card>
    );
}
