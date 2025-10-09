import React from "react";

const AboutPage = () => {
  const styles = {
    page: {
      backgroundColor: "#f0f4f8",
      minHeight: "100vh",
      padding: "80px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#2c3e50"
    },
    heading: { fontSize: "2.5rem", marginBottom: "20px" },
    paragraph: { fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "15px" }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>About Limkokwing University</h1>
      <p style={styles.paragraph}>
        Limkokwing University of Creative Technology is a leading international university
        known for innovation, creativity, and practical learning.
      </p>
      <p style={styles.paragraph}>
        Our mission is to nurture creative thinkers and leaders ready to make a difference
        in the global creative economy.
      </p>
      <p style={styles.paragraph}>
        We offer dynamic courses across multiple faculties, blending theory, practice, and
        industry collaboration.
      </p>
    </div>
  );
};

export default AboutPage;
