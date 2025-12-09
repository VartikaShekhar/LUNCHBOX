import React from "react";
import { Badge } from "react-bootstrap";

export default function Tag({ label, onClick, variant = "secondary" }) {
  return (
    <Badge 
      bg={variant}
      className="me-1 mb-1"
      style={{ 
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s"
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.opacity = "0.8";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {label}
    </Badge>
  );
}

