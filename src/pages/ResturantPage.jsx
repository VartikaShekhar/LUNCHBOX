import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import RestaurantDetailPanel from "../components/ResturantDetailPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import { supabase } from "../lib/supabase";

export default function RestaurantPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .single();

        if (error) throw error;
        setRestaurant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  if (loading) {
    return (
      <>
        <NavigationBar />
        <LoadingSpinner message="Loading restaurant..." />
      </>
    );
  }

  if (error || !restaurant) {
    return (
      <>
        <NavigationBar />
        <Container className="py-4">
          <Alert variant="danger">
            {error || "Restaurant not found."}
          </Alert>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
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
