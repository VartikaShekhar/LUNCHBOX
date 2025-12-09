import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import NavigationBar from "../components/NavigationBar";

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        setSuccess("Account created! Please check your email to verify your account.");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        setSuccess("Login successful!");
        setTimeout(() => navigate("/profile"), 1000);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              {isSignup && (
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-required="true"
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  minLength={6}
                />
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long.
                </Form.Text>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Loading..." : (isSignup ? "Sign Up" : "Login")}
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

