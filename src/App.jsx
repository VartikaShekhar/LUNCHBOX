// src/App.jsx
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import RestaurantPage from "./pages/ResturantPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      
        <Route path="/restaurants/:restaurantId" element={<RestaurantPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
