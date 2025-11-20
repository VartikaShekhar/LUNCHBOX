// src/App.jsx
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ListView from "./pages/ListView";
import RestaurantPage from "./pages/ResturantPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/lists/:listId" element={<ListView />} />
        <Route path="/restaurants/:restaurantId" element={<RestaurantPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
