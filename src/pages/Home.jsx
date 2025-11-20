import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import ListCard from "../components/ListCard";

// TEMP dummy data for check-in
const dummyLists = [
  { id: 1, title: "Madison Brunch Spots", creator: "Harshith", restaurantCount: 5 },
  { id: 2, title: "Best Indian Food in Town", creator: "Vartika", restaurantCount: 8 },
  { id: 3, title: "Cheap Eats Near Campus", creator: "Alex", restaurantCount: 12 },
  { id: 4, title: "Late Night Bites", creator: "Sarah", restaurantCount: 7 },
  { id: 5, title: "Top Coffee Shops", creator: "Maya", restaurantCount: 9 },
  { id: 6, title: "Romantic Dinner Spots", creator: "David", restaurantCount: 4 },
  { id: 7, title: "Vegan-Friendly Restaurants", creator: "Priya", restaurantCount: 6 },
  { id: 8, title: "Best Pizza Around Madison", creator: "John", restaurantCount: 5 },
  { id: 9, title: "Taco Tour List", creator: "Sofia", restaurantCount: 11 },
  { id: 10, title: "Dessert Tour", creator: "Emma", restaurantCount: 10 },
  { id: 11, title: "Food Trucks of Madison", creator: "Kevin", restaurantCount: 3 },
  { id: 12, title: "Fine Dining Picks", creator: "Olivia", restaurantCount: 4 },
  { id: 13, title: "Thai Food Favorites", creator: "Ravi", restaurantCount: 6 },
  { id: 14, title: "Korean BBQ Must-Try", creator: "Jiwoo", restaurantCount: 7 },
  { id: 15, title: "BBQ & Grill Tour", creator: "Marcus", restaurantCount: 8 },
  { id: 16, title: "Top Sushi Spots", creator: "Hana", restaurantCount: 6 },
  { id: 17, title: "Burgers Around Town", creator: "Tom", restaurantCount: 9 },
  { id: 18, title: "Healthy & Fresh Meals", creator: "Chloe", restaurantCount: 5 },
  { id: 19, title: "Breakfast All Day", creator: "Liam", restaurantCount: 7 },
  { id: 20, title: "Noodle Places You Must Try", creator: "Wei", restaurantCount: 10 },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "16px" }}>
      <NavigationBar />

      <h2 style={{ fontSize: "25px" }}></h2>

      <div className="feed-container">
        {dummyLists.map(list => (
          <ListCard
            key={list.id}
            title={list.title}
            creator={list.creator}
            restaurantCount={list.restaurantCount}
            onClick={() => navigate(`/lists/${list.id}`)}
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
