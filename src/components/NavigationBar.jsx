import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";

export default function NavigationBar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      {/* Left side — App Name */}
      <span style={{ fontSize: "32px", color: "#ff5722" }}>LUNCHBOX</span>

      {/* Right side — ABOUT button (PUT IT HERE) */}
      <span>
        <Button
          variant="light"
          onClick={() => navigate("/about")}
          style={{ border: "none" }}
        >
          <InfoCircle size={22} />
        </Button>
      </span>
    </div>
  );
}