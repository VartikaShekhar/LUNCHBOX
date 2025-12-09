import React from "react";
import { Container } from "react-bootstrap";

export default function EmptyState({ message, icon = "🍽️" }) {
  return (
    <Container className="text-center py-5">
      <div style={{ fontSize: "4rem" }} role="img" aria-label="Empty state icon">
        {icon}
      </div>
      <p className="text-muted mt-3 fs-5">{message}</p>
    </Container>
  );
}

