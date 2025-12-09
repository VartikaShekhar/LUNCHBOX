import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Modal, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import NavigationBar from "../components/NavigationBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [deletingListId, setDeletingListId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "" });
  const [stats, setStats] = useState({ listsCreated: 0, restaurantsAdded: 0 });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user's lists
  useEffect(() => {
    if (user) {
      fetchUserLists();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserLists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserLists(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Count lists
      const { count: listsCount } = await supabase
        .from('lists')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id);

      // Count restaurants
      const { count: restaurantsCount } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id);

      setStats({
        listsCreated: listsCount || 0,
        restaurantsAdded: restaurantsCount || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setEditFormData({ title: list.title, description: list.description || "" });
    setShowEditModal(true);
  };

  const handleUpdateList = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('lists')
        .update({
          title: editFormData.title,
          description: editFormData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingList.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingList(null);
      fetchUserLists();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteList = async () => {
    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', deletingListId);

      if (error) throw error;

      setShowDeleteModal(false);
      setDeletingListId(null);
      fetchUserLists();
      fetchUserStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <NavigationBar />
        <LoadingSpinner message="Loading profile..." />
      </>
    );
  }

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

        {/* Profile Header */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <Card.Title as="h2">{user.user_metadata?.name || "User"}</Card.Title>
                <Card.Text className="text-muted">{user.email}</Card.Text>
                <Card.Text className="text-muted">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </Card.Text>
              </Col>
              <Col md={4} className="text-md-end">
                <Button
                  variant="outline-danger"
                  className="w-100"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={6} md={3}>
                <div className="text-center">
                  <h4>{stats.listsCreated}</h4>
                  <p className="text-muted">Lists Created</p>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="text-center">
                  <h4>{stats.restaurantsAdded}</h4>
                  <p className="text-muted">Restaurants Added</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* User's Lists */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">My Lists</h4>
          <Button variant="primary" onClick={() => navigate("/")}>
            + Create New List
          </Button>
        </div>

        {userLists.length === 0 ? (
          <Alert variant="info">
            You haven't created any lists yet. Create your first list to get started!
          </Alert>
        ) : (
          userLists.map((list) => (
            <Card key={list.id} className="shadow-sm mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <Card.Title
                      className="mb-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/lists/${list.id}`)}
                    >
                      {list.title}
                    </Card.Title>
                    {list.description && (
                      <Card.Text className="text-muted small">
                        {list.description}
                      </Card.Text>
                    )}
                    <Card.Text className="text-muted small">
                      Created {new Date(list.created_at).toLocaleDateString()}
                    </Card.Text>
                  </Col>
                  <Col md={4} className="text-md-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditList(list)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setDeletingListId(list.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>

      {/* Edit List Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateList}>
            <Form.Group className="mb-3" controlId="editTitle">
              <Form.Label>List Title</Form.Label>
              <Form.Control
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this list? This action cannot be undone.</p>
          <p className="text-danger">
            <strong>Warning:</strong> All restaurants in this list will also be deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteList}>
            Delete List
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

