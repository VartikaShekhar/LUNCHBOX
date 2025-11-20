import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";
import RestaurantItem from "../components/RestaurantItem";
import ListHeader from "../components/ListHeader";

// Dummy data for restaurants in a list
const dummyRestaurants = [
    {
        id: 1,
        name: "Mickies Dairy Bar",
        rating: 4.6,
        tags: ["Brunch", "American"],
    },
    {
        id: 2,
        name: "Village Pizza",
        rating: 4.3,
        tags: ["Pizza", "Italian"],
    },
    {
        id: 3,
        name: "Noodles & Company",
        rating: 4.1,
        tags: ["Noodles", "Asian"],
    },
    {
        id: 4,
        name: "Chipotle",
        rating: 4.0,
        tags: ["Mexican", "Fast Food"],
    },
];

// Dummy list info
const dummyListInfo = {
    1: { title: "Madison Brunch Spots", creator: "Harshith" },
    2: { title: "Best Indian Food in Town", creator: "Vartika" },
    3: { title: "Cheap Eats Near Campus", creator: "Alex" },
};

export default function ListView() {
    const { listId } = useParams();
    const navigate = useNavigate();

    const listInfo = dummyListInfo[listId] || {
        title: "Restaurant List",
        creator: "Unknown",
    };

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    };

    return (
        <>
            <NavigationBar />

            <Container className="py-4">
                <ListHeader title={listInfo.title} creator={listInfo.creator} />

                <Row className="mt-4">
                    <Col>
                        <h4>Restaurants in this list:</h4>
                        {dummyRestaurants.map((restaurant) => (
                            <RestaurantItem
                                key={restaurant.id}
                                restaurant={restaurant}
                                onClick={() => handleRestaurantClick(restaurant.id)}
                            />
                        ))}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
