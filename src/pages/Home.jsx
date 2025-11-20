import React from "react";
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
            onClick={() => console.log("Clicked list", list.id)}
          />
        ))}
      </div>
    </div>
  );
}