import React, { useEffect } from "react";
import bgImage from "../assets/images/limkokwing.jpeg"; // your image path
import "../styles/HomePage.css";

const HomePage = () => {
  useEffect(() => {
    // Set the background on body
    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.margin = 0;
    document.body.style.height = "100vh";
    document.body.style.width = "100%";
    document.body.style.color = "#fff";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.margin = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.color = "";
    };
  }, []);

  return (
    <>
      <div className="homepage-overlay">
        <div className="homepage-container">
          <h1 className="homepage-title">Welcome to Limkokwing University Reporting System</h1>
          <p className="homepage-subtitle">
            Excellence • Innovation • Creativity
          </p>

          <div className="homepage-description">
            <p>
              This platform provides an efficient way for{" "}
              <strong>students, lecturers, principal lectures and program leaders</strong> to monitor,
              report, and collaborate on academic performance.
            </p>
            <p>
              <em>
                “Empowering the future through education, innovation, and
                creativity at Limkokwing University of Creative Technology,
                Lesotho.”
              </em>
            </p>
          </div>

        </div>

        <footer className="homepage-footer">
          <p>
            © {new Date().getFullYear()} Limkokwing University of Creative Technology – Lesotho Campus
          </p>
          <p className="footer-tagline">
            “Breaking Boundaries, Building Futures.”
          </p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
