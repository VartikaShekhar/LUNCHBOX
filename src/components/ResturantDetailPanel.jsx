import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

export default function RestaurantDetailPanel({ restaurant }) {
    const { name, rating, tags, address, hours, description } = restaurant;

    return (
        <Card className="shadow-sm mb-3">
            <Card.Body>
                <Card.Title className="d-flex align-items-center justify-content-between">
                    <span>{name}</span>
                    <span>
                        ⭐ <strong>{rating}</strong>/5
                    </span>
                </Card.Title>

                <div className="mb-2">
                    {tags.map((tag) => (
                        <Badge key={tag} bg="secondary" className="me-1">
                            {tag}
                        </Badge>
                    ))}
                </div>

                {address && (
                    <Card.Text className="mb-1">
                        <strong>Address: </strong>
                        {address}
                    </Card.Text>
                )}

                {hours && (
                    <Card.Text className="mb-1">
                        <strong>Hours: </strong>
                        {hours}
                    </Card.Text>
                )}

                {description && (
                    <Card.Text className="mt-2">{description}</Card.Text>
                )}

                <Button variant="primary" className="mt-2">
                    + Add to List
                </Button>
            </Card.Body>
        </Card>
    );
}
