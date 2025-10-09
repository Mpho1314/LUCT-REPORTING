import React from "react";

const FacultiesPage = () => {
  const styles = {
    page: {
      backgroundColor: "#f0f4f8",
      minHeight: "100vh",
      padding: "80px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#2c3e50"
    },
    heading: { fontSize: "2.5rem", marginBottom: "20px" },
    facultyCard: {
      backgroundColor: "#fff",
      padding: "20px",
      margin: "10px 0",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    facultyTitle: { fontSize: "1.5rem", fontWeight: "600", marginBottom: "10px" },
    facultyDesc: { fontSize: "1rem", lineHeight: "1.5" }
  };

  const faculties = [
    { name: "Faculty of Design", description: "Innovative programs in fashion, graphics, and industrial design." },
    { name: "Faculty of Media & Communication", description: "Courses in media, journalism, and creative communication." },
    { name: "Faculty of Technology", description: "Computer science, IT, and software development programs." },
    { name: "Faculty of Business", description: "Management, entrepreneurship, and leadership courses." }
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Our Faculties</h1>
      {faculties.map((f, index) => (
        <div key={index} style={styles.facultyCard}>
          <h2 style={styles.facultyTitle}>{f.name}</h2>
          <p style={styles.facultyDesc}>{f.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FacultiesPage;
