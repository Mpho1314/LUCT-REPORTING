const db = require('../db/connection');

// GET all courses
const getCourses = (req, res) => {
  const sql = `
    SELECT c.id, c.name, c.code, c.faculty, u.username AS lecturer
    FROM courses c
    LEFT JOIN users u ON c.lecturer_id = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// POST add course
const addCourse = (req, res) => {
  const { name, code, faculty, lecturer_id } = req.body;
  const sql = `INSERT INTO courses (name, code, faculty, lecturer_id) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, code, faculty, lecturer_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Course added", id: result.insertId });
  });
};

// PUT update course
const updateCourse = (req, res) => {
  const { id } = req.params;
  const { name, code, faculty, lecturer_id } = req.body;
  const sql = `UPDATE courses SET name=?, code=?, faculty=?, lecturer_id=? WHERE id=?`;
  db.query(sql, [name, code, faculty, lecturer_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Course updated" });
  });
};

// DELETE course
const deleteCourse = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM courses WHERE id=?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Course deleted" });
  });
};

module.exports = { getCourses, addCourse, updateCourse, deleteCourse };
