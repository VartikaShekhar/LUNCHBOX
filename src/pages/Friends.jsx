import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert, ListGroup, Badge, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Friends() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("username");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchFriends();
  }, [user, navigate]);

  const fetchFriends = async () => {
    setLoading(true);
    setError("");
    const { data: friendRows, error } = await supabase
      .from("friends")
      .select("id, friend_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const friendIds = (friendRows || []).map((row) => row.friend_id).filter(Boolean);
    let profileMap = {};

    if (friendIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, name, email")
        .in("id", friendIds);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      profileMap = Object.fromEntries(profileData.map((p) => [p.id, p]));
    }

    const hydrated = (friendRows || []).map((row) => ({
      ...row,
      friend: profileMap[row.friend_id] || null,
    }));

    setFriends(hydrated);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError("");
    setSuccess("");

    const column = searchBy === "email" ? "email" : "username";
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, name, email")
      .ilike(column, `%${searchTerm}%`)
      .limit(10);

    if (error) {
      setError(error.message);
      setSearchResults([]);
    } else {
      const currentFriends = new Set(friends.map((f) => f.friend_id));
      const filtered = (data || []).filter(
        (profile) => profile.id !== user.id && !currentFriends.has(profile.id)
      );
      setSearchResults(filtered);
    }
    setSearching(false);
  };

  const handleAddFriend = async (friendId) => {
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("friends")
      .insert([{ user_id: user.id, friend_id: friendId }])
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Friend added!");
      setSearchResults((prev) => prev.filter((p) => p.id !== friendId));
      fetchFriends();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <NavigationBar />
      <Container className="py-4" style={{ maxWidth: "900px" }}>
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Card.Title as="h2" className="mb-3">
              Find Friends
            </Card.Title>
            {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}
            <Form onSubmit={handleSearch}>
              <Row className="g-2 align-items-end">
                <Col md={4}>
                  <Form.Label>Search By</Form.Label>
                  <Form.Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                  </Form.Select>
                </Col>
                <Col md={8}>
                  <Form.Label>Enter a username or email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., foodie123 or friend@gmail.com"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="secondary" onClick={() => setSearchResults([])}>
                  Clear
                </Button>
                <Button type="submit" variant="primary" disabled={searching}>
                  {searching ? "Searching..." : "Search"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {searchResults.length > 0 && (
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h4">Results</Card.Title>
              <ListGroup variant="flush">
                {searchResults.map((profile) => (
                  <ListGroup.Item key={profile.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{profile.name || profile.username || "User"}</div>
                      <div className="text-muted small">
                        {profile.username ? `@${profile.username}` : "No username set"} · {profile.email}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleAddFriend(profile.id)}>
                      Add Friend
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}

        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title as="h3">Your Friends</Card.Title>
            {loading ? (
              <p className="text-muted mb-0">Loading friends...</p>
            ) : friends.length === 0 ? (
              <p className="text-muted mb-0">No friends yet. Find someone above!</p>
            ) : (
              <ListGroup variant="flush">
                {friends.map((f) => (
                  <ListGroup.Item key={f.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{f.friend?.name || f.friend?.username || "User"}</div>
                      <div className="text-muted small">
                        {f.friend?.username ? `@${f.friend?.username}` : "No username set"} · {f.friend?.email}
                      </div>
                    </div>
                    <Badge bg="light" text="dark">
                      Added
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
