import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import RestaurantDetailPanel from "../components/ResturantDetailPanel";

// TEMP dummy data – replace later if your group has real data
const dummyRestaurants = [
  {
    id: 1,
    name: "Mickies Dairy Bar",
    rating: 4.6,
    tags: ["Brunch", "American"],
    address: "123 Monroe St, Madison, WI",
    hours: "8:00 AM – 2:00 PM",
    description: "Classic Madison brunch spot with huge portions. Known for their famous scrambler and friendly service.",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&h=600&fit=crop",
    imageAlt: "Delicious brunch plate with eggs, bacon, and toast at Mickies Dairy Bar"
  },
  {
    id: 2,
    name: "Village Pizza",
    rating: 4.3,
    tags: ["Pizza", "Italian"],
    address: "456 State St, Madison, WI",
    hours: "11:00 AM – 10:00 PM",
    description: "Casual pizza place great for group dinners. Authentic Italian recipes with fresh ingredients.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
    imageAlt: "Fresh Italian pizza with melted cheese and basil"
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

  return (
    <>
      <NavigationBar />

      <Container className="py-4">
        <Row>
          <Col md={12}>
            <RestaurantDetailPanel restaurant={restaurant} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
