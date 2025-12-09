import React from "react";
import { Card, Button, Image } from "react-bootstrap";
import Tag from "./Tag";

export default function RestaurantDetailPanel({ restaurant }) {
    const { name, rating, tags = [], address, hours, description, image, imageAlt, image_alt } = restaurant;
    const altText = imageAlt || image_alt;

    return (
        <Card className="shadow-sm mb-3">
            {image && (
                <Image
                    src={image}
                    alt={altText || `Photo of ${name}`}
                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
            )}
            <Card.Body>
                <h1 className="mb-3">{name}</h1>

                {rating && (
                    <p className="mb-3">
                        <span aria-label={`Rating: ${rating} out of 5 stars`}>
                            ⭐ <strong>{rating}</strong>/5
                        </span>
                    </p>
                )}

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
                    <>
                        <h2 className="h5 mt-4">About</h2>
                        <Card.Text>{description}</Card.Text>
                    </>
                )}
            </Card.Body>
        </Card>
    );
}
