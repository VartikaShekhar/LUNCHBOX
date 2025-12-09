import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Row, Col, Form, Alert, Button, Modal } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import RestaurantItem from "../components/RestaurantItem";
import ListHeader from "../components/ListHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRestaurants } from "../hooks/useRestaurants";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function ListView() {
    const { listId } = useParams();
    const navigate = useNavigate();
    const [selectedTag, setSelectedTag] = useState(null);
    const [sortBy, setSortBy] = useState("rating");
    const [listInfo, setListInfo] = useState(null);
    const [loadingList, setLoadingList] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        hours: "",
        rating: "",
        tags: "",
        image: "",
        image_alt: ""
    });
    const [addError, setAddError] = useState("");

    const { restaurants, loading, error, createRestaurant, deleteRestaurant, refetch } = useRestaurants(listId);
    const { user } = useAuth();

    // Fetch list info
    useEffect(() => {
        const fetchListInfo = async () => {
            const { data, error } = await supabase
                .from('lists')
                .select('*')
                .eq('id', listId)
                .single();

            if (data) setListInfo(data);
            setLoadingList(false);
        };
        fetchListInfo();
    }, [listId]);

    const handleAddRestaurant = async (e) => {
        e.preventDefault();
        setAddError("");

        if (!user) {
            setAddError("Please login to add restaurants");
            return;
        }

        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);

        const { error } = await createRestaurant({
            name: formData.name,
            description: formData.description,
            address: formData.address,
            hours: formData.hours,
            rating: formData.rating ? parseFloat(formData.rating) : null,
            tags: tagsArray,
            image: formData.image || null,
            image_alt: formData.image_alt || null,
            list_id: listId,
            created_by: user.id
        });

        if (error) {
            setAddError(error);
        } else {
            setShowAddModal(false);
            setFormData({
                name: "",
                description: "",
                address: "",
                hours: "",
                rating: "",
                tags: "",
                image: "",
                image_alt: ""
            });
            refetch();
        }
    };

    const handleTagClick = (tag) => {
        setSelectedTag(selectedTag === tag ? null : tag);
    };

    const handleDeleteRestaurant = async (id) => {
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            await deleteRestaurant(id);
            refetch();
        }
    };

    // Filter and sort restaurants
    let filteredRestaurants = restaurants;

    if (selectedTag) {
        filteredRestaurants = filteredRestaurants.filter(r =>
            r.tags && r.tags.includes(selectedTag)
        );
    }

    filteredRestaurants = [...filteredRestaurants].sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    if (loadingList || loading) {
        return (
            <>
                <NavigationBar />
                <LoadingSpinner message="Loading list..." />
            </>
        );
    }

    if (!listInfo) {
        return (
            <>
                <NavigationBar />
                <Container className="py-4">
                    <Alert variant="danger">List not found</Alert>
                    <Button onClick={() => navigate("/")}>Back to Home</Button>
                </Container>
            </>
        );
    }

    return (
        <>
            <NavigationBar />
            <Container className="py-4">
                <ListHeader
                    title={listInfo.title}
                    creator={listInfo.creator_name || "Anonymous"}
                />

                {error && <Alert variant="danger">{error}</Alert>}



                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Restaurants</h3>
                    <Button
                        variant="primary"
                        onClick={() => user ? setShowAddModal(true) : navigate("/login")}
                        aria-label="Add a new restaurant to this list"
                    >
                        + Add Restaurant
                    </Button>
                </div>

                {selectedTag && (
                    <Alert variant="info" dismissible onClose={() => setSelectedTag(null)}>
                        Filtering by tag: <strong>{selectedTag}</strong>
                    </Alert>
                )}

                {/* Sort Controls */}
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort restaurants by"
                        >
                            <option value="rating">Highest Rating</option>
                            <option value="name">Name (A-Z)</option>
                        </Form.Select>
                    </Col>
                </Row>

                {/* Restaurants List */}
                {filteredRestaurants.length === 0 ? (
                    <Alert variant="info">
                        {restaurants.length === 0
                            ? "No restaurants in this list yet. Add the first one!"
                            : "No restaurants match the selected tag."}
                    </Alert>
                ) : (
                    filteredRestaurants.map(restaurant => (
                        <div key={restaurant.id} className="position-relative">
                            <RestaurantItem
                                restaurant={restaurant}
                                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                                onTagClick={handleTagClick}
                            />
                            {user && user.id === restaurant.created_by && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0 m-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteRestaurant(restaurant.id);
                                    }}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </Container>

            {/* Add Restaurant Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Restaurant to {listInfo.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {addError && <Alert variant="danger">{addError}</Alert>}
                    <Form onSubmit={handleAddRestaurant}>
                        <Form.Group className="mb-3" controlId="restaurantName">
                            <Form.Label>Restaurant Name *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Mickies Dairy Bar"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="restaurantDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Describe the restaurant..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="restaurantAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="123 Main St, Madison, WI"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="restaurantHours">
                                    <Form.Label>Hours</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="9:00 AM - 5:00 PM"
                                        value={formData.hours}
                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="restaurantRating">
                                    <Form.Label>Rating (0-5)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        placeholder="4.5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="restaurantTags">
                                    <Form.Label>Tags (comma-separated)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Brunch, American, Casual"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="restaurantImage">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="restaurantImageAlt">
                            <Form.Label>Image Description (for accessibility)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Describe the image for screen readers"
                                value={formData.image_alt}
                                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Restaurant
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
