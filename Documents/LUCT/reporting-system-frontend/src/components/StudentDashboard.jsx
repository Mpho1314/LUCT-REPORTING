import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService, lectureService } from "../services/api";
import LectureRatings from "./LectureRatings";
import "../styles/StudentDashboard.css";
import Footer from "./Footer";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingRefreshTrigger, setRatingRefreshTrigger] = useState(0);

  const [searchCourse, setSearchCourse] = useState("");
  const [searchLecture, setSearchLecture] = useState("");

  // 🔹 Track active section (either "courses", "lectures", or "monitoring")
  const [activeSection, setActiveSection] = useState("courses");

  const navigate = useNavigate();

  const refreshLectures = async () => {
    try {
      const lecturesResponse = await lectureService.getLectures();
      const formattedLectures = lecturesResponse.data.map((l) => ({
        ...l,
        course: l.course_name || "Unknown Course",
        title: l.topic || "No Topic",
        status: l.status || "Pending",
      }));
      setLectures(formattedLectures);
    } catch (err) {
      console.error(err);
      setError("Failed to load lectures.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesResponse = await courseService.getCourses();
        const formattedCourses = coursesResponse.data.map((c) => ({
          ...c,
          lecturer: c.lecturer || "TBA",
        }));
        setCourses(formattedCourses);
        await refreshLectures();
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRatingSubmitted = (lectureId) => {
    setRatingRefreshTrigger((prev) => prev + 1);
    setLectures((prevLectures) =>
      prevLectures.map((l) =>
        l.id === lectureId ? { ...l, status: "Rated" } : l
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchCourse.toLowerCase())
  );
  const filteredLectures = lectures.filter((l) =>
    l.topic.toLowerCase().includes(searchLecture.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* 🔹 Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-title">Student Dashboard</div>
        <div className="navbar-actions">
          <button
            className={`btn ${
              activeSection === "courses"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setActiveSection("courses")}
          >
            My Courses
          </button>
          <button
            className={`btn ${
              activeSection === "lectures" ? "btn-info" : "btn-outline-info"
            }`}
            onClick={() => setActiveSection("lectures")}
          >
            Upcoming Lectures
          </button>
          <button
            className={`btn ${
              activeSection === "monitoring"
                ? "btn-success"
                : "btn-outline-success"
            }`}
            onClick={() => setActiveSection("monitoring")}
          >
            Monitoring
          </button>
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
          <>
            {/* 🔹 Courses Section */}
            {activeSection === "courses" && (
              <div className="dashboard-section">
                <h2>My Courses</h2>
                <input
                  type="text"
                  placeholder="Search Courses..."
                  value={searchCourse}
                  onChange={(e) => setSearchCourse(e.target.value)}
                  className="form-control mb-2"
                />
                <div className="dashboard-grid">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <div key={course.id} className="dashboard-card">
                        <h3>{course.name}</h3>
                        <p>
                          <strong>Code:</strong> {course.code}
                        </p>
                        <p>
                          <strong>Faculty:</strong> {course.faculty}
                        </p>
                        <p>
                          <strong>Lecturer:</strong> {course.lecturer}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No courses found.</p>
                  )}
                </div>
              </div>
            )}

            {/* 🔹 Lectures Section */}
            {activeSection === "lectures" && (
              <div className="dashboard-section">
                <h2>Upcoming Lectures</h2>
                <input
                  type="text"
                  placeholder="Search Lectures..."
                  value={searchLecture}
                  onChange={(e) => setSearchLecture(e.target.value)}
                  className="form-control mb-2"
                />
                <div className="dashboard-grid">
                  {filteredLectures.length > 0 ? (
                    filteredLectures.map((lecture) => (
                      <div key={lecture.id} className="dashboard-card">
                        <h3>{lecture.title}</h3>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(lecture.date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Course:</strong> {lecture.course}
                        </p>
                        <p>
                          <strong>Status:</strong> {lecture.status}
                        </p>

                        <LectureRatings
                          lectureId={lecture.id}
                          showForm={true}
                          refreshTrigger={ratingRefreshTrigger}
                          onRatingSubmitted={() =>
                            handleRatingSubmitted(lecture.id)
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <p>No upcoming lectures.</p>
                  )}
                </div>
              </div>
            )}

            {/* 🔹 Monitoring Section */}
            {activeSection === "monitoring" && (
              <div className="dashboard-section monitoring-section">
                <h2>Performance Monitoring</h2>
                <p className="monitoring-intro">
                  Track your academic performance, attendance, and ratings for each
                  lecture and course.
                </p>

                <div className="monitoring-table-container">
                  <table className="monitoring-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Lecture Topic</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectures.length > 0 ? (
                        lectures.map((lecture) => (
                          <tr key={lecture.id}>
                            <td>{lecture.course}</td>
                            <td>{lecture.title}</td>
                            <td>
                              {new Date(lecture.date).toLocaleDateString()}
                            </td>
                            <td>{lecture.status}</td>
                            <td>
                              {lecture.status === "Rated"
                                ? "✅ Rated"
                                : "❌ Not Rated"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            No lecture data available for monitoring.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
