import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Container, Row, Col, Form, Button, Modal, Alert } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import ListCard from "../components/ListCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLists } from "../hooks/useLists";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Home() {
  const heroImage = "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80";
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [createError, setCreateError] = useState("");

  const { lists, loading, error, createList, refetch } = useLists();
  const { user } = useAuth();

  const handleCreateList = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!user) {
      setCreateError("Please login to create a list");
      return;
    }

    // Fetch username from profile
    let creatorName = user.email;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profile?.username) {
        creatorName = profile.username;
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }

    const { error } = await createList({
      title: newListTitle,
      description: newListDescription,
      creator_id: user.id,
      creator_name: creatorName,
    });

    if (error) {
      setCreateError(error);
    } else {
      setShowCreateModal(false);
      setNewListTitle("");
      setNewListDescription("");
      refetch();
    }
  };

  // Filter and sort lists
  const filteredLists = lists
    .filter(list =>
      list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (list.creator_name && list.creator_name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "recent") return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  if (loading) {
    return (
      <>
        <NavigationBar />
        <LoadingSpinner message="Loading restaurant lists..." />
      </>
    );
  }

  return (
      <>
        <NavigationBar />

        <Container className="py-4">
          <div className="hero mb-4">
            <div>
              <p className="text-uppercase text-muted mb-1" style={{ letterSpacing: "0.08em", fontWeight: 600 }}>
                Your next meal starts here
              </p>
              <h1 className="mb-2">Find and share the best spots in town</h1>
              <p className="mb-3">
                Browse curated restaurant lists from friends, save your own picks, and never forget that perfect brunch place again.
              </p>
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={() => user ? setShowCreateModal(true) : navigate("/login")}>
                  Create a list
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate("/about")}>
                  Learn more
                </Button>
              </div>
            </div>
            <div>
              <img src={heroImage} alt="Table with shared dishes" />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Discover Restaurant Lists</h2>
            <Button
            variant="primary"
            onClick={() => user ? setShowCreateModal(true) : navigate("/login")}
            aria-label="Create a new restaurant list"
          >
            + Create New List
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Search and Filter Controls */}
        <Row className="mb-4">
          <Col md={8}>
            <Form.Control
              type="search"
              placeholder="Search lists by name or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search restaurant lists"
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort lists by"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Lists Grid */}
        <Row>
          {filteredLists.map(list => (
            <Col key={list.id} xs={12} sm={6} lg={4} className="mb-3">
              <ListCard
                title={list.title}
                creator={list.creator_name || "Anonymous"}
                restaurantCount={list.restaurant_count || 0}
                onClick={() => navigate(`/lists/${list.id}`)}
              />
            </Col>
          ))}
        </Row>

        {filteredLists.length === 0 && !loading && (
          <p className="text-center text-muted mt-4">
            {lists.length === 0 ? "No lists yet. Create the first one!" : "No lists found matching your search."}
          </p>
        )}
      </Container>

      {/* Create List Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Restaurant List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && <Alert variant="danger">{createError}</Alert>}
          <Form onSubmit={handleCreateList}>
            <Form.Group className="mb-3" controlId="listTitle">
              <Form.Label>List Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Best Brunch Spots"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="listDescription">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your list..."
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create List
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
