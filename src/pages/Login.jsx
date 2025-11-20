import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isSignup ? "Signup successful!" : "Login successful!");
    navigate("/");
  };

  return (
    <>
      <NavigationBar />

      <Container className="py-4" style={{ maxWidth: "500px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title as="h2" className="text-center mb-4">
              {isSignup ? "Sign Up" : "Login"}
            </Card.Title>

            <Form onSubmit={handleSubmit}>
              {isSignup && (
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                {isSignup ? "Sign Up" : "Login"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignup(!isSignup)}
                  style={{ textDecoration: "none" }}
                >
                  {isSignup
                    ? "Already have an account? Login"
                    : "Don't have an account? Sign Up"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

