import React from "react";
import { Form } from "react-bootstrap";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <Form.Control
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
      className="shadow-sm"
    />
  );
}

