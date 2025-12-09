import React from "react";
import { Spinner, Container } from "react-bootstrap";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Container className="text-center py-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">{message}</span>
      </Spinner>
      <p className="text-muted mt-3">{message}</p>
    </Container>
  );
}

