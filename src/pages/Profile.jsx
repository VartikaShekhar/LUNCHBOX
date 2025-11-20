import React from "react";
import { Container, Card, Row, Col, Button, Badge } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

export default function Profile() {
  // Dummy user data
  const user = {
    name: "Harshith Peta",
    email: "harshith@example.com",
    bio: "Food enthusiast and CS student. Always looking for the best places to eat!",
    listsCreated: 5,
    restaurantsAdded: 12,
  };

  // Dummy lists created by user
  const userLists = [
    { id: 1, title: "Madison Brunch Spots", restaurantCount: 5 },
    { id: 2, title: "Late Night Eats", restaurantCount: 7 },
    { id: 3, title: "Coffee Shops", restaurantCount: 4 },
  ];

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        {/* Profile Header */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <Card.Title as="h2">{user.name}</Card.Title>
                <Card.Text className="text-muted">{user.email}</Card.Text>
                <Card.Text>{user.bio}</Card.Text>
              </Col>
              <Col md={4} className="text-md-end">
                <Button variant="outline-primary" className="mb-2 w-100">
                  Edit Profile
                </Button>
                <Button variant="outline-secondary" className="w-100">
                  Settings
                </Button>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={6} md={3}>
                <div className="text-center">
                  <h4>{user.listsCreated}</h4>
                  <p className="text-muted">Lists Created</p>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="text-center">
                  <h4>{user.restaurantsAdded}</h4>
                  <p className="text-muted">Restaurants Added</p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* User's Lists */}
        <h4 className="mb-3">My Lists</h4>
        {userLists.map((list) => (
          <Card key={list.id} className="shadow-sm mb-3">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <Card.Title className="mb-1">{list.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {list.restaurantCount} restaurants
                  </Card.Text>
                </Col>
                <Col md={4} className="text-md-end">
                  <Button variant="outline-primary" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    Delete
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}

        <Button variant="primary" className="mt-3">
          + Create New List
        </Button>
      </Container>
    </>
  );
}

