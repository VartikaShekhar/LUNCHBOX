import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container" style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Lunchbox</h1>
                <p style={styles.subtitle}>
                    Discover and share ranked lists of your favorite restaurants.
                </p>
            </header>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Lists</h2>
                <p>See what your friends have been ranking lately.</p>
                <button style={styles.button} onClick={() => navigate("/feed")}>
                    View Feed
                </button>
            </section>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Explore Themes</h2>
                <p>Check out trending restaurant lists and new ideas.</p>
                <button style={styles.button} onClick={() => navigate("/explore")}>
                    Explore Now
                </button>
            </section>

            <footer style={styles.footer}>
                <p>Made by the Lunchbox Team</p>
            </footer>
        </div>
    );
};

const styles = {
    container: {
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        color: "#333",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
    },
    header: {
        textAlign: "center",
        marginBottom: "2rem",
    },
    title: {
        fontSize: "2.5rem",
        marginBottom: "0.5rem",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#555",
    },
    section: {
        marginBottom: "2rem",
        padding: "1.5rem",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    sectionTitle: {
        fontSize: "1.5rem",
        marginBottom: "0.5rem",
    },
    button: {
        display: "inline-block",
        marginTop: "0.5rem",
        padding: "0.6rem 1rem",
        backgroundColor: "#007AFF",
        color: "#fff",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "500",
    },
    footer: {
        textAlign: "center",
        marginTop: "3rem",
        fontSize: "0.9rem",
        color: "#888",
    },
};

export default Home;
