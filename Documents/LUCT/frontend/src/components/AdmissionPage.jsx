import React from "react";

const AdmissionsPage = () => {
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
      <h1 style={styles.heading}>Admissions</h1>
      <p style={styles.paragraph}>
        Join Limkokwing University and unlock your creative potential. We welcome applications
        from students around the world.
      </p>
      <p style={styles.paragraph}>
        Our admission process is straightforward: submit your application online, provide
        necessary documents, and our admissions team will guide you every step of the way.
      </p>
      <p style={styles.paragraph}>
        Explore scholarship opportunities and financial aid to make your education affordable.
      </p>
    </div>
  );
};

export default AdmissionsPage;
