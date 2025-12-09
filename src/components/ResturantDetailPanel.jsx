import React from "react";
import { Card, Button, Image } from "react-bootstrap";
import Tag from "./Tag";

export default function RestaurantDetailPanel({ restaurant }) {
    const { name, rating, tags, address, hours, description, image, imageAlt } = restaurant;

    return (
        <Card className="shadow-sm mb-3">
            {image && (
                <Image
                    src={image}
                    alt={imageAlt || `Photo of ${name}`}
                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
            )}
            <Card.Body>
                <Card.Title className="d-flex align-items-center justify-content-between">
                    <h1 className="h2">{name}</h1>
                    <span>
                        ⭐ <strong>{rating}</strong>/5
                    </span>
                </Card.Title>

                <div className="mb-3">
                    {tags.map((tag) => (
                        <Tag key={tag} label={tag} variant="secondary" />
                    ))}
                </div>

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

                {description && (
                    <Card.Text className="mt-3">{description}</Card.Text>
                )}

                <Button variant="primary" className="mt-3">
                    + Add to List
                </Button>
            </Card.Body>
        </Card>
    );
}
