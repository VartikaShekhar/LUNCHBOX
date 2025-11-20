import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

export default function NavigationBar() {
  const navigate = useNavigate();

  return (
    <Navbar
      expand="lg"
      className="mb-0"
      style={{
        backgroundColor: "#ff5722",
        padding: "1rem 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <Container fluid style={{ maxWidth: "100%", padding: "0 2rem" }}>
        {/* App Name/Logo */}
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            fontSize: "32px",
            color: "white",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
        >
          🍱 LUNCHBOX
        </Navbar.Brand>

        {/* Toggle for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: "white" }} />

        {/* Navigation Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-4">
            <Nav.Link
              onClick={() => navigate("/")}
              style={{ color: "white", fontSize: "18px", marginRight: "1rem" }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/about")}
              style={{ color: "white", fontSize: "18px", marginRight: "1rem" }}
            >
              About
            </Nav.Link>
          </Nav>

          {/* Right side buttons */}
          <Nav>
            <Nav.Link
              onClick={() => navigate("/login")}
              style={{ color: "white", fontSize: "18px", marginRight: "1rem" }}
            >
              Login/Signup
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/profile")}
              style={{ color: "white", fontSize: "18px", marginRight: "1rem" }}
            >
              Profile
            </Nav.Link>
            <Button
              variant="light"
              onClick={() => alert("Logged out!")}
              className="ms-2"
              style={{ fontWeight: "bold" }}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}