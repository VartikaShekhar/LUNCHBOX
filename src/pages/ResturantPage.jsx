import React from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
} from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

// TEMP dummy data – replace later if your group has real data
const dummyRestaurants = [
  {
    id: 1,
    name: "Mickies Dairy Bar",
    rating: 4.6,
    imageUrl: "https://via.placeholder.com/400x250?text=Mickies",
    tags: ["Brunch", "American"],
    address: "123 Monroe St, Madison, WI",
    hours: "8:00 AM – 2:00 PM",
    description: "Classic Madison brunch spot with huge portions.",
  },
  {
    id: 2,
    name: "Village Pizza",
    rating: 4.3,
    imageUrl: "https://via.placeholder.com/400x250?text=Village+Pizza",
    tags: ["Pizza", "Italian"],
    address: "456 State St, Madison, WI",
    hours: "11:00 AM – 10:00 PM",
    description: "Casual pizza place great for group dinners.",
  },
];

export default function RestaurantPage() {
  const { restaurantId } = useParams();

  const restaurant = dummyRestaurants.find(
    (r) => String(r.id) === String(restaurantId)
  );

  if (!restaurant) {
    return (
      <>
        <NavigationBar />
        <Container className="py-4">
          <p>Restaurant not found.</p>
        </Container>
      </>
    );
  }

  const { name, rating, imageUrl, tags, address, hours, description } =
    restaurant;

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        <Row>
          {/* Image */}
          <Col md={5} className="mb-3">
            <Card className="shadow-sm">
              {imageUrl && (
                <Card.Img
                  variant="top"
                  src={imageUrl}
                  alt={name}
                  style={{ objectFit: "cover", maxHeight: "260px" }}
                />
              )}
            </Card>
          </Col>

          {/* Details panel */}
          <Col md={7}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title className="d-flex align-items-center justify-content-between">
                  <span>{name}</span>
                  <span>
                    ⭐ <strong>{rating}</strong>/5
                  </span>
                </Card.Title>

                <div className="mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} bg="secondary" className="me-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {address && (
                  <Card.Text className="mb-1">
                    <strong>Address: </strong>
                    {address}
                  </Card.Text>
                )}

                {hours && (
                  <Card.Text className="mb-1">
                    <strong>Hours: </strong>
                    {hours}
                  </Card.Text>
                )}

                {description && (
                  <Card.Text className="mt-2">{description}</Card.Text>
                )}

                <Button variant="primary" className="mt-2">
                  + Add to List
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
