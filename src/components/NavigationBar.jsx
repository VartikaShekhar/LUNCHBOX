import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function NavigationBar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className="mb-0"
      style={{
        backgroundColor: "#d84315",
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
              style={{
                color: "#000000",
                fontSize: "18px",
                marginRight: "1rem",
                fontWeight: "600",
                textShadow: "none"
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/about")}
              style={{
                color: "#000000",
                fontSize: "18px",
                marginRight: "1rem",
                fontWeight: "600",
                textShadow: "none"
              }}
            >
              About
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/friends")}
              style={{
                color: "#000000",
                fontSize: "18px",
                marginRight: "1rem",
                fontWeight: "600",
                textShadow: "none"
              }}
            >
              Friends
            </Nav.Link>
          </Nav>

          {/* Right side buttons */}
          <Nav>
            {user ? (
              <>
                <Nav.Link
                  onClick={() => navigate("/profile")}
                  style={{ color: "black", fontSize: "18px", marginRight: "1rem" }}
                >
                  Profile
                </Nav.Link>
                <Button
                  variant="light"
                  onClick={handleLogout}
                  className="ms-2"
                  style={{ fontWeight: "bold" }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link
                onClick={() => navigate("/login")}
                style={{ color: "black", fontSize: "18px", marginRight: "1rem" }}
              >
                Login/Signup
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
