import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Alert, Button, Modal } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import RestaurantItem from "../components/RestaurantItem";
import ListHeader from "../components/ListHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import Tag from "../components/Tag";
import { useRestaurants } from "../hooks/useRestaurants";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { uploadImageFile } from "../lib/storage";

export default function ListView() {
    const { listId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedTag, setSelectedTag] = useState(null);
    const [sortBy, setSortBy] = useState("rating");
    const [searchTerm, setSearchTerm] = useState("");
    const [minRating, setMinRating] = useState("any");
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
        image_alt: "",
        website: "",
        maps_link: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [addError, setAddError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        address: "",
        hours: "",
        rating: "",
        tags: "",
        image: "",
        image_alt: "",
        website: "",
        maps_link: ""
    });
    const [editImageFile, setEditImageFile] = useState(null);
    const [uploadingEditImage, setUploadingEditImage] = useState(false);
    const [editError, setEditError] = useState("");

    const { restaurants, loading, error, createRestaurant, updateRestaurant, deleteRestaurant, refetch } = useRestaurants(listId);
    const { user } = useAuth();

    // Fetch list info
    useEffect(() => {
        const fetchListInfo = async () => {
            const { data, error } = await supabase
                .from('lists')
                .select('*')
                .eq('id', listId)
                .single();

            if (data) {
                // Fetch username from profile
                if (data.creator_id) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', data.creator_id)
                        .single();

                    if (profile?.username) {
                        data.creator_name = profile.username;
                    }
                }
                setListInfo(data);
            }
            setLoadingList(false);
        };
        fetchListInfo();
    }, [listId]);

    useEffect(() => {
        const tagFromUrl = searchParams.get("tag");
        setSelectedTag(tagFromUrl || null);
    }, [searchParams]);

    const handleAddRestaurant = async (e) => {
        e.preventDefault();
        setAddError("");

        if (!user) {
            setAddError("Please login to add restaurants");
            return;
        }
        if (!isOwner) {
            setAddError("Only the list owner can add restaurants to this list.");
            return;
        }

        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);

        let imageUrl = null;
        const imageAltText = formData.image_alt.trim();

        if (imageFile) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const ext = imageFile.name?.split(".").pop()?.toLowerCase();
            if (!allowedTypes.includes(imageFile.type) && !["jpg", "jpeg", "png"].includes(ext)) {
                setAddError("Please upload a JPG or PNG image.");
                return;
            }

            if (!imageAltText) {
                setAddError("Please add an image description (alt text) for accessibility.");
                return;
            }

            try {
                setUploadingImage(true);
                const { data: uploaded, error: uploadError } = await uploadImageFile(
                    imageFile,
                    { pathPrefix: user ? `user-${user.id}` : "" }
                );

                if (uploadError || !uploaded?.publicUrl) {
                    throw new Error(uploadError || "Could not get uploaded image URL");
                }

                imageUrl = uploaded.publicUrl;
            } catch (uploadErr) {
                setAddError(`Image upload failed: ${uploadErr.message || uploadErr}`);
                setUploadingImage(false);
                return;
            } finally {
                setUploadingImage(false);
            }
        }

        const { error } = await createRestaurant({
            name: formData.name,
            description: formData.description,
            address: formData.address,
            hours: formData.hours,
            rating: formData.rating ? parseFloat(formData.rating) : null,
            tags: tagsArray,
            image: imageUrl || null,
            image_alt: imageAltText || null,
            website: formData.website?.trim() || null,
            maps_link: formData.maps_link?.trim() || null,
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
                image_alt: "",
                website: "",
                maps_link: ""
            });
            setImageFile(null);
            refetch();
        }
    };

    const handleTagClick = (tag) => {
        const nextTag = selectedTag === tag ? null : tag;
        setSelectedTag(nextTag);
        const params = new URLSearchParams(searchParams);
        if (nextTag) {
            params.set("tag", nextTag);
        } else {
            params.delete("tag");
        }
        setSearchParams(params);
    };

    const handleEditRestaurant = (restaurant) => {
        setEditingRestaurant(restaurant);
        setEditFormData({
            name: restaurant.name || "",
            description: restaurant.description || "",
            address: restaurant.address || "",
            hours: restaurant.hours || "",
            rating: restaurant.rating || "",
            tags: Array.isArray(restaurant.tags) ? restaurant.tags.join(", ") : "",
            image: restaurant.image || "",
            image_alt: restaurant.image_alt || "",
            website: restaurant.website || "",
            maps_link: restaurant.maps_link || ""
        });
        setEditImageFile(null);
        setEditError("");
        setShowEditModal(true);
    };

    const handleUpdateRestaurant = async (e) => {
        e.preventDefault();
        setEditError("");

        if (!user || !isOwner) {
            setEditError("Only the list owner can edit restaurants.");
            return;
        }

        const tagsArray = editFormData.tags.split(',').map(t => t.trim()).filter(t => t);

        let imageUrl = editFormData.image?.trim() || null;
        const imageAltText = editFormData.image_alt.trim();

        if (editImageFile) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const ext = editImageFile.name?.split(".").pop()?.toLowerCase();
            if (!allowedTypes.includes(editImageFile.type) && !["jpg", "jpeg", "png"].includes(ext)) {
                setEditError("Please upload a JPG or PNG image.");
                return;
            }

            if (!imageAltText) {
                setEditError("Please add an image description (alt text) for accessibility.");
                return;
            }

            try {
                setUploadingEditImage(true);
                const { data: uploaded, error: uploadError } = await uploadImageFile(
                    editImageFile,
                    { pathPrefix: user ? `user-${user.id}` : "" }
                );

                if (uploadError || !uploaded?.publicUrl) {
                    throw new Error(uploadError || "Could not get uploaded image URL");
                }

                imageUrl = uploaded.publicUrl;
            } catch (uploadErr) {
                setEditError(`Image upload failed: ${uploadErr.message || uploadErr}`);
                setUploadingEditImage(false);
                return;
            } finally {
                setUploadingEditImage(false);
            }
        } else if (imageUrl && !imageAltText) {
            setEditError("Please add an image description (alt text) for accessibility.");
            return;
        }

        const { error } = await updateRestaurant(editingRestaurant.id, {
            name: editFormData.name,
            description: editFormData.description,
            address: editFormData.address,
            hours: editFormData.hours,
            rating: editFormData.rating ? parseFloat(editFormData.rating) : null,
            tags: tagsArray,
            image: imageUrl || null,
            image_alt: imageAltText || null,
            website: editFormData.website?.trim() || null,
            maps_link: editFormData.maps_link?.trim() || null
        });

        if (error) {
            setEditError(error);
        } else {
            setShowEditModal(false);
            setEditingRestaurant(null);
            refetch();
        }
    };

    const handleDeleteRestaurant = async (id) => {
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            await deleteRestaurant(id);
            refetch();
        }
    };

    const clearFilters = () => {
        setSelectedTag(null);
        setSearchTerm("");
        setMinRating("any");
        setSortBy("rating");
        setSearchParams({});
    };

    const availableTags = Array.from(
        new Set(
            (restaurants || []).flatMap((restaurant) => restaurant.tags || [])
        )
    );

    // Filter and sort restaurants
    const normalizedSearch = searchTerm.trim().toLowerCase();
    let filteredRestaurants = restaurants.filter((restaurant) => {
        const matchesTag = selectedTag ? (restaurant.tags || []).includes(selectedTag) : true;
        const matchesSearch = !normalizedSearch
            ? true
            : (restaurant.name?.toLowerCase().includes(normalizedSearch)) ||
              (restaurant.description?.toLowerCase().includes(normalizedSearch)) ||
              (restaurant.tags || []).some((tag) => tag.toLowerCase().includes(normalizedSearch));
        const meetsRating = minRating === "any" ? true : (restaurant.rating || 0) >= Number(minRating);
        return matchesTag && matchesSearch && meetsRating;
    });

    filteredRestaurants = [...filteredRestaurants].sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
        return 0;
    });

    const isOwner = user && listInfo && listInfo.creator_id === user.id;

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
                        onClick={() => {
                            if (!user) return navigate("/login");
                            if (!isOwner) {
                                setAddError("Only the list owner can add restaurants to this list.");
                                return;
                            }
                            setShowAddModal(true);
                        }}
                        aria-label="Add a new restaurant to this list"
                        disabled={!user || !isOwner}
                    >
                        + Add Restaurant
                    </Button>
                </div>
                {!user && (
                    <Alert variant="info">Sign in as the list owner to add restaurants.</Alert>
                )}
                {user && !isOwner && (
                    <Alert variant="warning">Only the list owner can add restaurants to this list.</Alert>
                )}

                {/* Filter & Sort Controls */}
                <Row className="g-3 mb-3">
                    <Col xs={12} md={6}>
                        <Form.Control
                            type="search"
                            placeholder="Search by name, description, or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search restaurants"
                        />
                    </Col>
                    <Col xs={6} md={3}>
                        <Form.Select
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            aria-label="Filter by minimum rating"
                        >
                            <option value="any">Any rating</option>
                            <option value="3">3.0+ stars</option>
                            <option value="4">4.0+ stars</option>
                            <option value="4.5">4.5+ stars</option>
                        </Form.Select>
                    </Col>
                    <Col xs={6} md={3}>
                        <Form.Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort restaurants by"
                        >
                            <option value="rating">Highest Rating</option>
                            <option value="newest">Newest Added</option>
                            <option value="name">Name (A-Z)</option>
                        </Form.Select>
                    </Col>
                </Row>

                {availableTags.length > 0 && (
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <span className="fw-semibold">Filter by tag:</span>
                        {availableTags.map((tag) => (
                            <Tag
                                key={tag}
                                label={tag}
                                variant={selectedTag === tag ? "primary" : "secondary"}
                                onClick={() => handleTagClick(tag)}
                            />
                        ))}
                        {(selectedTag || searchTerm || minRating !== "any" || sortBy !== "rating") && (
                            <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                                Clear filters
                            </Button>
                        )}
                    </div>
                )}

                {selectedTag && (
                    <Alert variant="info" dismissible onClose={() => setSelectedTag(null)}>
                        Filtering by tag: <strong>{selectedTag}</strong>
                    </Alert>
                )}

                {/* Restaurants List */}
                {filteredRestaurants.length === 0 ? (
                    <Alert variant="info">
                        {restaurants.length === 0
                            ? "No restaurants in this list yet. Add the first one!"
                            : "No restaurants match the current filters. Try clearing them."}
                    </Alert>
                ) : (
                    filteredRestaurants.map(restaurant => (
                        <div key={restaurant.id} className="position-relative">
                            <RestaurantItem
                                restaurant={restaurant}
                                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                                onTagClick={handleTagClick}
                            />
                            {isOwner && (
                                <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditRestaurant(restaurant);
                                        }}
                                        aria-label={`Edit ${restaurant.name}`}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRestaurant(restaurant.id);
                                        }}
                                        aria-label={`Delete ${restaurant.name}`}
                                    >
                                        Delete
                                    </Button>
                                </div>
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

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="restaurantWebsite">
                                    <Form.Label>Website (optional)</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="https://restaurant-website.com"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                    <Form.Text className="text-muted">
                                        Link to the restaurant's website
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="restaurantMapsLink">
                                    <Form.Label>Google Maps Link (optional)</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="https://maps.google.com/..."
                                        value={formData.maps_link}
                                        onChange={(e) => setFormData({ ...formData, maps_link: e.target.value })}
                                    />
                                    <Form.Text className="text-muted">
                                        Link to Google Maps location
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="restaurantImageFile">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                            <Form.Text className="text-muted">
                                Choose a JPG or PNG photo (optional). We will host it for you.
                            </Form.Text>
                            {imageFile && (
                                <div className="mt-1 text-success small" aria-live="polite">
                                    Selected: {imageFile.name}
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="restaurantImageAlt">
                            <Form.Label>Image Description (for accessibility)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Describe the image for screen readers"
                                value={formData.image_alt}
                                onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                            />
                            <Form.Text className="text-muted">
                                Required if you upload an image; helps screen readers.
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={uploadingImage}>
                                {uploadingImage ? "Uploading image..." : "Add Restaurant"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Restaurant Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Restaurant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editError && <Alert variant="danger">{editError}</Alert>}
                    <Form onSubmit={handleUpdateRestaurant}>
                        <Form.Group className="mb-3" controlId="editRestaurantName">
                            <Form.Label>Restaurant Name *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Mickies Dairy Bar"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editRestaurantDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Describe the restaurant..."
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="editRestaurantAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="123 Main St, Madison, WI"
                                        value={editFormData.address}
                                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="editRestaurantHours">
                                    <Form.Label>Hours</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="9:00 AM - 5:00 PM"
                                        value={editFormData.hours}
                                        onChange={(e) => setEditFormData({ ...editFormData, hours: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="editRestaurantRating">
                                    <Form.Label>Rating (0-5)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        placeholder="4.5"
                                        value={editFormData.rating}
                                        onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="editRestaurantTags">
                                    <Form.Label>Tags (comma-separated)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Brunch, American, Casual"
                                        value={editFormData.tags}
                                        onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="editRestaurantWebsite">
                                    <Form.Label>Website (optional)</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="https://restaurant-website.com"
                                        value={editFormData.website}
                                        onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                                    />
                                    <Form.Text className="text-muted">
                                        Link to the restaurant's website
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="editRestaurantMapsLink">
                                    <Form.Label>Google Maps Link (optional)</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="https://maps.google.com/..."
                                        value={editFormData.maps_link}
                                        onChange={(e) => setEditFormData({ ...editFormData, maps_link: e.target.value })}
                                    />
                                    <Form.Text className="text-muted">
                                        Link to Google Maps location
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="editRestaurantImageFile">
                            <Form.Label>Upload New Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                            />
                            <Form.Text className="text-muted">
                                Choose a JPG or PNG photo (optional). Leave blank to keep current image.
                            </Form.Text>
                            {editImageFile && (
                                <div className="mt-1 text-success small" aria-live="polite">
                                    Selected: {editImageFile.name}
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="editRestaurantImageAlt">
                            <Form.Label>Image Description (for accessibility)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Describe the image for screen readers"
                                value={editFormData.image_alt}
                                onChange={(e) => setEditFormData({ ...editFormData, image_alt: e.target.value })}
                            />
                            <Form.Text className="text-muted">
                                Required if you have an image; helps screen readers.
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={uploadingEditImage}>
                                {uploadingEditImage ? "Uploading image..." : "Update Restaurant"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
