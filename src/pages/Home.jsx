import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import ListCard from "../components/ListCard";

// TEMP dummy data for check-in
const dummyLists = [
  {
    id: 1,
    title: "Madison Brunch Spots",
    creator: "Harshith",
    restaurantCount: 5,
  },
  {
    id: 2,
    title: "Best Indian Food in Town",
    creator: "Vartika",
    restaurantCount: 8,
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "16px" }}>
      <NavigationBar />

      <h2>Trending Lists</h2>

      <div className="feed-container">
        {dummyLists.map(list => (
          <ListCard
            key={list.id}
            title={list.title}
            creator={list.creator}
            restaurantCount={list.restaurantCount}
            onClick={() => navigate(`/restaurants/${list.id}`)}
          />
        ))}
      </div>

      {/* OPTIONAL: Demo button so TAs can see your RestaurantPage immediately */}
      <button
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/restaurants/1")}
      >
        Demo Restaurant Page
      </button>
    </div>
  );
}
