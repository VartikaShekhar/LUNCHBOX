import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
   
      }}
    >

      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          fontSize: "14px",
          borderRadius: "8px",
          cursor: "pointer",
          border: "1px solid #ccc",
          backgroundColor: "#333",
        }}
      >
        ← Back
      </button>

      <h1>About Us</h1>

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
    </div>
  );
}