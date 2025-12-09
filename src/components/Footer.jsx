import React from "react";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light mt-5 py-4 border-top">
      <Container className="text-center">
        <p className="text-muted mb-1">
          Made with ❤️ by hungry CS students
        </p>
        <p className="text-muted small mb-0">
          © 2024 Lunchbox. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

