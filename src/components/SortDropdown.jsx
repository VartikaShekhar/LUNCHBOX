import React from "react";
import { Form } from "react-bootstrap";

export default function SortDropdown({ value, onChange, options, label = "Sort by" }) {
  return (
    <Form.Select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="shadow-sm"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}

