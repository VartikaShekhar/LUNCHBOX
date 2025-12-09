import React from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

export default function About() {
  return (
    <>
      <NavigationBar />

      <Container className="py-5 text-center">
        <h1 className="mb-4">About Lunchbox</h1>

        <p style={{ fontSize: "18px", marginTop: "20px" }}>
          <i>“Good food is the best excuse for procrastination.”</i>
        </p>

        <p
          style={{
            fontSize: "16px",
            marginTop: "20px",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          This app was created by a group of extremely hungry CS majors from
          college who spent more time debating where to eat than actually coding.
          <br />
          <br />
          So we built a platform where everyone can share their favorite restaurant
          lists — because choosing a place to eat shouldn’t be harder than
          debugging recursion.
        </p>

        <p style={{ marginTop: "30px", opacity: 0.8 }}>
          Made with ❤️, JavaScript, and way too many late-night snacks.
        </p>
      </Container>
    </>
  );
}