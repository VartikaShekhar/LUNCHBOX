import React from "react";
import { Card } from "react-bootstrap";

export default function ListHeader({ title, creator }) {
    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title as="h2">{title}</Card.Title>
                <Card.Text className="text-muted">
                    Created by <strong>{creator}</strong>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
