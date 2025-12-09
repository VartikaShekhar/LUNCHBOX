// src/App.jsx
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import ListView from "./pages/ListViewNew";
import RestaurantPage from "./pages/ResturantPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/lists/:listId" element={<ListView />} />
          <Route path="/restaurants/:restaurantId" element={<RestaurantPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
