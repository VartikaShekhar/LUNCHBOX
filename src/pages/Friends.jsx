import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert, ListGroup, Badge, Row, Col, Modal } from "react-bootstrap";
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
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

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
    const { data: requestRows, error } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const accepted = (requestRows || []).filter(
      (r) => r.status === "accepted"
    );
    const outgoingPending = (requestRows || []).filter(
      (r) => r.status === "pending" && r.requester_id === user.id
    );
    const incomingPending = (requestRows || []).filter(
      (r) => r.status === "pending" && r.addressee_id === user.id
    );

    const friendIds = accepted.map((row) =>
      row.requester_id === user.id ? row.addressee_id : row.requester_id
    );

    const profileIds = [
      ...new Set([
        ...friendIds,
        ...outgoingPending.map((r) => r.addressee_id),
        ...incomingPending.map((r) => r.requester_id),
      ]),
    ].filter(Boolean);

    let profileMap = {};

    if (profileIds.length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, name, email")
        .in("id", profileIds);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      profileMap = Object.fromEntries(profileData.map((p) => [p.id, p]));
    }

    const hydratedFriends = accepted.map((row) => {
      const friendId = row.requester_id === user.id ? row.addressee_id : row.requester_id;
      return {
        ...row,
        friend: profileMap[friendId] || null,
      };
    });

    setFriends(hydratedFriends);
    setOutgoing(
      outgoingPending.map((row) => ({
        ...row,
        profile: profileMap[row.addressee_id] || null,
      }))
    );
    setIncoming(
      incomingPending.map((row) => ({
        ...row,
        profile: profileMap[row.requester_id] || null,
      }))
    );

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
    const { data, error } = await supabase
      .from("friend_requests")
      .insert([{ requester_id: user.id, addressee_id: friendId, status: "pending" }])
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Request sent!");
      setSearchResults((prev) => prev.filter((p) => p.id !== friendId));
      fetchFriends();
    }
  };

  const handleRespond = async (requestId, nextStatus) => {
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: nextStatus })
      .eq("id", requestId);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(nextStatus === "accepted" ? "Friend request accepted!" : "Friend request declined.");
      fetchFriends();
    }
  };

  const openProfile = (profile) => {
    if (!profile) return;
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const ProfileDisplay = ({ profile }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openProfile(profile)}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProfile(profile);
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="fw-bold">{profile?.name || profile?.username || "User"}</div>
      <div className="text-muted small">
        {profile?.username ? `@${profile?.username}` : "No username set"} · {profile?.email}
      </div>
    </div>
  );

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
                    <ProfileDisplay profile={profile} />
                    <Button size="sm" onClick={() => handleAddFriend(profile.id)}>
                      Add Friend
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}

        {/* Incoming Requests */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Card.Title as="h3">Incoming Requests</Card.Title>
            {loading ? (
              <p className="text-muted mb-0">Loading...</p>
            ) : incoming.length === 0 ? (
              <p className="text-muted mb-0">No incoming requests.</p>
            ) : (
              <ListGroup variant="flush">
                {incoming.map((req) => (
                  <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                    <ProfileDisplay profile={req.profile} />
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-success" onClick={() => handleRespond(req.id, "accepted")}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleRespond(req.id, "declined")}>
                        Decline
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>

        {/* Outgoing Requests */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Card.Title as="h3">Outgoing Requests</Card.Title>
            {loading ? (
              <p className="text-muted mb-0">Loading...</p>
            ) : outgoing.length === 0 ? (
              <p className="text-muted mb-0">No pending requests.</p>
            ) : (
              <ListGroup variant="flush">
                {outgoing.map((req) => (
                  <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                    <ProfileDisplay profile={req.profile} />
                    <Badge bg="warning" text="dark">
                      Pending
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>

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
                    <ProfileDisplay profile={f.friend} />
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

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProfile ? (
            <>
              <p className="mb-1"><strong>Name:</strong> {selectedProfile.name || "User"}</p>
              <p className="mb-1"><strong>Username:</strong> {selectedProfile.username ? `@${selectedProfile.username}` : "Not set"}</p>
              <p className="mb-0"><strong>Email:</strong> {selectedProfile.email}</p>
            </>
          ) : (
            <p>Unable to load profile.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
