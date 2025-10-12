import React from "react";

const NewsPage = () => {
  const styles = {
    page: {
      backgroundColor: "#f0f4f8",
      minHeight: "100vh",
      padding: "80px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#2c3e50"
    },
    heading: { fontSize: "2.5rem", marginBottom: "20px" },
    newsCard: {
      backgroundColor: "#fff",
      padding: "20px",
      margin: "10px 0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    newsTitle: { fontSize: "1.5rem", fontWeight: "600", marginBottom: "10px" },
    newsDesc: { fontSize: "1rem", lineHeight: "1.5" }
  };

  const newsItems = [
    { title: "New Creative Lab Opens", description: "Limkokwing University launches a state-of-the-art creative lab for students." },
    { title: "Student Wins International Design Award", description: "Our student won a prestigious international award for innovative design." },
    { title: "Annual Graduation Ceremony", description: "Celebrating the achievements of our graduates across all faculties." }
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>University News</h1>
      {newsItems.map((n, index) => (
        <div key={index} style={styles.newsCard}>
          <h2 style={styles.newsTitle}>{n.title}</h2>
          <p style={styles.newsDesc}>{n.description}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsPage;
