import { useState, useEffect } from "react";
import { courseService, lectureService, reportService } from "../services/api";
import "../styles/PLDashboard.css";
import LectureRatings from "./LectureRatings";
import Footer from "./Footer";
function PLDashboard({ onLogout }) {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("courses"); // active tab
  const [ratingsVisible, setRatingsVisible] = useState({});
  const [newCourse, setNewCourse] = useState({ name: "", code: "", faculty: "", lecturer_id: "" });
  const [editCourseId, setEditCourseId] = useState(null);
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesResp, lecturesResp, reportsResp] = await Promise.all([
        courseService.getCourses(),
        lectureService.getLectures(),
        reportService.getReports(),
      ]);

      setCourses(coursesResp.data || []);
      setLectures(lecturesResp.data || []);
      setReports(reportsResp.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editCourseId) await courseService.updateCourse(editCourseId, newCourse);
      else await courseService.createCourse(newCourse);

      setNewCourse({ name: "", code: "", faculty: "", lecturer_id: "" });
      setEditCourseId(null);
      setView("courses");
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Failed to save course.");
    }
  };

  const handleEditCourse = (course) => {
    setNewCourse(course);
    setEditCourseId(course.id);
    setView("addCourse");
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await courseService.deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete course.");
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await lectureService.deleteLecture(lectureId);
      setLectures(prev => prev.filter(l => l.id !== lectureId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete lecture.");
    }
  };

  const toggleRatings = (lectureId) => {
    setRatingsVisible(prev => ({ ...prev, [lectureId]: !prev[lectureId] }));
  };

  const handleFeedbackSubmit = async (lectureId) => {
    try {
      const feedback = feedbackInputs[lectureId] || "";
      if (!feedback.trim()) return alert("Enter feedback first.");

      await reportService.addPRLFeedback(lectureId, { prl_feedback: feedback });
      setFeedbackInputs(prev => ({ ...prev, [lectureId]: "" }));
      fetchData();
      alert("Feedback submitted!");
    } catch (err) {
      console.error(err);
      setError("Failed to submit feedback.");
    }
  };

  return (
    <>
      <div className="pl-navbar">
        <h1 className="pl-title">Program Leader Dashboard</h1>
        <div className="pl-buttons">
          <button onClick={() => setView("courses")}>Courses</button>
          <button onClick={() => setView("lectures")}>Lectures</button>
          <button onClick={() => setView("reports")}>Reports</button>
          <button onClick={() => setView("monitoring")}>Monitoring</button>
          <button onClick={() => setView("classes")}>Classes</button>
          <button onClick={() => setView("ratings")}>Rating</button>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <div className="loading-spinner">Loading...</div> : (
        <div className="dashboard-content">

          {/* Courses */}
          {view === "courses" && (
            <div className="dashboard-section">
              <h2>Courses</h2>
              <button className="btn btn-primary mb-2" onClick={() => setView("addCourse")}>Add New Course</button>
              <div className="dashboard-grid">
                {courses.map(course => (
                  <div key={course.id} className="dashboard-card">
                    <h3>{course.name}</h3>
                    <p><strong>Code:</strong> {course.code}</p>
                    <p><strong>Faculty:</strong> {course.faculty}</p>
                    <p><strong>Lecturer ID:</strong> {course.lecturer_id}</p>
                    <div className="course-actions">
                      <button onClick={() => handleEditCourse(course)} className="btn btn-warning">Edit</button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Add/Edit Course */}
{view === "addCourse" && (
  <div>
    <h2>{editCourseId ? "Edit Course" : "Add Course"}</h2>
    <form className="add-course-form" onSubmit={handleSaveCourse}>
      <input
        type="text"
        placeholder="Course Name"
        value={newCourse.name}
        onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Course Code"
        value={newCourse.code}
        onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
        required
      />

      <select
        value={newCourse.faculty}
        onChange={e => setNewCourse({ ...newCourse, faculty: e.target.value })}
        required
      >
        <option value="">-- Select Faculty --</option>
        <option value="Design">Design</option>
        <option value="IT">IT</option>
        <option value="Business">Business</option>
        <option value="Engineering">Engineering</option>
      </select>

      <input
        type="text"
        placeholder="Stream / Specialization"
        value={newCourse.stream || ""}
        onChange={e => setNewCourse({ ...newCourse, stream: e.target.value })}
      />

      <input
        type="text"
        placeholder="Lecturer ID"
        value={newCourse.lecturer_id}
        onChange={e => setNewCourse({ ...newCourse, lecturer_id: e.target.value })}
        required
      />

      <button type="submit" className="btn btn-primary">
        {editCourseId ? "Update" : "Add"} Course
      </button>
    </form>
  </div>
)}


          {/* Monitoring */}
          {view === "monitoring" && (
            <div className="dashboard-section">
              <h2>Monitoring</h2>
              <table className="monitoring-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Lecture</th>
                    <th>Date</th>
                    <th>Students Present</th>
                    <th>Total Students</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lectures.map(l => (
                    <tr key={l.id}>
                      <td>{courses.find(c => c.id === l.course_id)?.name || "N/A"}</td>
                      <td>{l.topic}</td>
                      <td>{l.date}</td>
                      <td>{l.students_present ?? 0}</td>
                      <td>{l.total_students ?? 0}</td>
                      <td>{l.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Classes */}
          {view === "classes" && (
            <div className="dashboard-section">
              <h2>Classes Overview</h2>
              <div className="dashboard-grid">
                {lectures.map(l => (
                  <div key={l.id} className="dashboard-card">
                    <p><strong>Course:</strong> {courses.find(c => c.id === l.course_id)?.name || "N/A"}</p>
                    <p><strong>Lecture:</strong> {l.topic}</p>
                    <p><strong>Lecturer:</strong> {l.lecturer_id}</p>
                    <p><strong>Date:</strong> {l.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings */}
          {view === "ratings" && (
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

        </div>
      )}
    </>
  );
}

export default PLDashboard;
