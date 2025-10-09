import React, { useState } from "react";
import { FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:info@limkokwing.ac?subject=Message from ${email}&body=${message}`;
  };

  const styles = {
    page: {
      backgroundColor: "#f0f4f8",  // solid background
      minHeight: "100vh",
      padding: "80px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#2c3e50"
    },
    heading: {
      fontSize: "2.5rem",
      textAlign: "center",
      marginBottom: "40px"
    },
    iconContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "30px"
    },
    form: {
      maxWidth: "500px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1rem"
    },
    textarea: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      minHeight: "120px"
    },
    button: {
      padding: "12px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#2c3e50",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "1rem"
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Contact Us</h1>

      <div style={styles.iconContainer}>
        <FaWhatsapp size={30} color="#25D366" />
        <FaFacebook size={30} color="#1877F2" />
        <FaTwitter size={30} color="#1DA1F2" />
        <FaEnvelope size={30} color="#EA4335" />
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          style={styles.textarea}
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
