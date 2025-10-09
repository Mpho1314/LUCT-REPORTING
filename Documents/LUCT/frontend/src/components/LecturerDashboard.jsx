import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { lectureService } from "../services/api";
import "../styles/LectureDashboard.css";
import Footer from "./Footer";

function LecturerDashboard() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const response = await lectureService.getLecturesByLecturer();
        setLectures(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load lectures.");
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="top-navbar">
        <div className="navbar-title">Lecturer Dashboard</div>
        <div className="navbar-actions">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="dashboard-grid">
            {lectures.length > 0 ? (
              lectures.map((lecture) => (
                <div key={lecture.id} className="dashboard-card">
                  <h3>{lecture.topic}</h3>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(lecture.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Course:</strong> {lecture.course_name}
                  </p>
                  <p>
                    <strong>Status:</strong> {lecture.status}
                  </p>
                </div>
              ))
            ) : (
              <p>No lectures assigned.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LecturerDashboard;
