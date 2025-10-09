import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { lectureService, reportService } from "../services/api";
import "../styles/PRLDashboard.css";
import LectureRatings from "./LectureRatings";
import Footer from "./Footer";
function PRLDashboard() {
  const [lectures, setLectures] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingsVisible, setRatingsVisible] = useState({});
  const [activeSection, setActiveSection] = useState("courses");

  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [lecturesResp, reportsResp] = await Promise.all([
          lectureService.getLectures(),
          reportService.getReports(),
        ]);

        const lecturesData = (lecturesResp.data || []).map((l) => ({
          ...l,
          faculty: l.faculty || "N/A",
          class_name: l.class_name || "N/A",
          week: l.week || "N/A",
          course_name: l.course_name || "N/A",
          course_code: l.course_code || "N/A",
          lecturer: l.lecturer || "N/A",
          students_present: l.students_present ?? 0,
          total_students: l.total_students ?? 0,
          venue: l.venue || "N/A",
          date: l.date || new Date(),
          time: l.time || "N/A",
          topic: l.topic || "N/A",
          learning_outcomes: l.learning_outcomes || "N/A",
          recommendations: l.recommendations || "N/A",
          status: l.status || "Pending",
        }));

        setLectures(lecturesData);
        setReports(reportsResp.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleRatings = (lectureId) => {
    setRatingsVisible(prev => ({ ...prev, [lectureId]: !prev[lectureId] }));
  };

  const handleAddFeedback = async () => {
    if (!selectedLecture || !feedback.trim()) return;

    try {
      setLoading(true);
      await reportService.addPRLFeedback(selectedLecture.id, {
        prl_feedback: feedback,
        status: "completed",
      });

      setLectures(prev =>
        prev.map(l => l.id === selectedLecture.id ? { ...l, status: "completed" } : l)
      );

      setReports(prev =>
        prev.map(r =>
          r.lecture_id === selectedLecture.id
            ? { ...r, prl_feedback: feedback, status: "completed" }
            : r
        )
      );

      setSelectedLecture(null);
      setFeedback("");
      alert("Feedback added successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to add feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const closeModal = () => {
    setSelectedLecture(null);
    setSelectedReport(null);
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-title">PRL Dashboard</div>
        <div className="navbar-actions">
          <button className="btn btn-primary" onClick={() => setActiveSection("courses")}>Courses</button>
          <button className="btn btn-info" onClick={() => setActiveSection("reports")}>Reports</button>
          <button className="btn btn-success" onClick={() => setActiveSection("monitoring")}>Monitoring</button>
          <button className="btn btn-warning" onClick={() => setActiveSection("rating")}>Rating</button>
          <button className="btn btn-secondary" onClick={() => setActiveSection("classes")}>Classes</button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-body">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            {/* Courses */}
            {activeSection === "courses" && (
              <div className="dashboard-section">
                <h2>All Courses & Lectures</h2>
                <div className="dashboard-grid">
                  {lectures.map(l => (
                    <div key={l.id} className="dashboard-card">
                      <h3>{l.course_name}</h3>
                      <p><strong>Topic:</strong> {l.topic}</p>
                      <p><strong>Week:</strong> {l.week}</p>
                      <p><strong>Lecturer:</strong> {l.lecturer}</p>
                      <button className="btn btn-sm btn-primary" onClick={() => setSelectedLecture(l)}>View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports */}
            {activeSection === "reports" && (
              <div className="dashboard-section">
                <h2>Reports & Feedback</h2>
                <div className="dashboard-grid">
                  {reports.map(r => (
                    <div key={r.id} className="dashboard-card">
                      <h3>{r.title || `Report #${r.id}`}</h3>
                      <p><strong>Date:</strong> {r.date ? new Date(r.date).toLocaleDateString() : "N/A"}</p>
                      <p><strong>Status:</strong> {r.status}</p>
                      <p><strong>PRL Feedback:</strong> {r.prl_feedback || "N/A"}</p>
                      <button className="btn btn-sm btn-primary" onClick={() => setSelectedReport(r)}>View Report</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monitoring */}
            {activeSection === "monitoring" && (
              <div className="dashboard-section">
                <h2>Performance Monitoring</h2>
                <div className="monitoring-table-container">
                  <table className="monitoring-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Week</th>
                        <th>Total Students</th>
                        <th>Students Present</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectures.map(l => (
                        <tr key={l.id}>
                          <td>{l.course_name}</td>
                          <td>{l.week}</td>
                          <td>{l.total_students}</td>
                          <td>{l.students_present}</td>
                          <td>{new Date(l.date).toLocaleDateString()}</td>
                          <td>{l.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Rating */}
            {activeSection === "rating" && (
              <div className="dashboard-section">
                <h2>Lecture Ratings</h2>
                <div className="dashboard-grid">
                  {lectures.map(l => (
                    <div key={l.id} className="dashboard-card">
                      <h3>{l.topic}</h3>
                      <LectureRatings lectureId={l.id} showForm={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Classes */}
            {activeSection === "classes" && (
              <div className="dashboard-section">
                <h2>Classes Overview</h2>
                <div className="dashboard-grid">
                  {lectures.map(l => (
                    <div key={l.id} className="dashboard-card">
                      <p><strong>Faculty:</strong> {l.faculty}</p>
                      <p><strong>Class:</strong> {l.class_name}</p>
                      <p><strong>Venue:</strong> {l.venue}</p>
                      <p><strong>Scheduled Time:</strong> {l.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lecture Modal */}
            {selectedLecture && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>{selectedLecture.topic}</h2>
                  <p><strong>Faculty:</strong> {selectedLecture.faculty}</p>
                  <p><strong>Class:</strong> {selectedLecture.class_name}</p>
                  <p><strong>Course:</strong> {selectedLecture.course_name} ({selectedLecture.course_code})</p>
                  <p><strong>Date:</strong> {new Date(selectedLecture.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedLecture.time}</p>
                  <p><strong>Venue:</strong> {selectedLecture.venue}</p>
                  <p><strong>Students Present:</strong> {selectedLecture.students_present}</p>
                  <p><strong>Total Students:</strong> {selectedLecture.total_students}</p>
                  <p><strong>Learning Outcomes:</strong> {selectedLecture.learning_outcomes}</p>
                  <p><strong>Recommendations:</strong> {selectedLecture.recommendations}</p>

                  <h3>Add Feedback</h3>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback..."
                  />
                  <div className="form-actions">
                    <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                    <button className="btn btn-primary" onClick={handleAddFeedback} disabled={!feedback.trim()}>Submit</button>
                  </div>
                </div>
              </div>
            )}

            {/* Report Modal */}
            {selectedReport && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>{selectedReport.title || `Report #${selectedReport.id}`}</h2>
                  <p><strong>Date:</strong> {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedReport.status}</p>
                  <p><strong>PRL Feedback:</strong> {selectedReport.prl_feedback || "N/A"}</p>
                  <button className="btn btn-secondary mt-3" onClick={closeModal}>Close</button>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}

export default PRLDashboard;
