import React, { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", faculty: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/courses/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setEditingId(null);
      } else {
        await fetch("http://localhost:5000/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm({ name: "", code: "", faculty: "" });
      fetchCourses();
    } catch (err) {
      console.error("Failed to submit course:", err);
    }
  };

  // Delete a course
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/courses/${id}`, { method: "DELETE" });
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  // Edit a course
  const handleEdit = (course) => {
    setForm({ name: course.name, code: course.code, faculty: course.faculty });
    setEditingId(course.id);
  };

  return (
    <div className="container mt-4">
      <h2>Courses Management</h2>

      {/* Form to Add/Update Course */}
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="row g-2">
          <div className="col">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Course Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="code"
              className="form-control"
              placeholder="Course Code"
              value={form.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="faculty"
              className="form-control"
              placeholder="Faculty"
              value={form.faculty}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Update" : "Add"} Course
            </button>
          </div>
        </div>
      </form>

      {/* Courses Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Code</th>
            <th>Faculty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No courses found
              </td>
            </tr>
          ) : (
            courses.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.code}</td>
                <td>{c.faculty}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Courses;
