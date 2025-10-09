const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // ✅ correct path
const { submitLecture, getLecturesByCourse } = require('../controllers/lectureController');

// ------------------------
// Lecturer submits a report
// POST /api/lectures
// ------------------------
router.post('/', submitLecture);

// ------------------------
// Get all lectures
// GET /api/lectures
// ------------------------
router.get('/', (req, res) => {
  const query = `
    SELECT l.*, u.username AS lecturer_name
    FROM lectures l
    JOIN users u ON l.lecturer_id = u.id
    ORDER BY l.date DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ------------------------
// Get lecture by ID
// GET /api/lectures/id/:lectureId
// ------------------------
router.get('/id/:lectureId', (req, res) => {
  const lectureId = req.params.lectureId;
  const query = `
    SELECT l.*, r.prl_feedback, u.username AS lecturer_name
    FROM lectures l
    LEFT JOIN reports r ON l.id = r.lecture_id
    JOIN users u ON l.lecturer_id = u.id
    WHERE l.id = ?
  `;
  db.query(query, [lectureId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// ------------------------
// Get lectures by course
// GET /api/lectures/course/:courseId
// ------------------------
router.get('/course/:courseId', getLecturesByCourse);

// ------------------------
// Update a lecture
// PUT /api/lectures/:lectureId
// ------------------------
router.put('/:lectureId', (req, res) => {
  const lectureId = req.params.lectureId;
  const {
    faculty_name,
    class_name,
    course_id,
    lecturer_id,
    date,
    scheduled_time,
    course_code,
    week,
    topic,
    outcomes,
    students_present,
    students_registered,
    attendance,
    venue,
    recommendations
  } = req.body;

  const query = `
    UPDATE lectures SET
      faculty_name = ?, 
      class_name = ?, 
      course_id = ?, 
      lecturer_id = ?, 
      date = ?, 
      scheduled_time = ?, 
      course_code = ?, 
      week = ?, 
      topic = ?, 
      outcomes = ?, 
      students_present = ?, 
      students_registered = ?, 
      attendance = ?, 
      venue = ?, 
      recommendations = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      faculty_name,
      class_name,
      course_id,
      lecturer_id,
      date,
      scheduled_time,
      course_code,
      week,
      topic,
      outcomes,
      students_present,
      students_registered,
      attendance,
      venue,
      recommendations,
      lectureId
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Lecture updated successfully" });
    }
  );
});

// ------------------------
// Delete a lecture
// DELETE /api/lectures/:lectureId
// ------------------------
router.delete('/:lectureId', (req, res) => {
  const lectureId = req.params.lectureId;
  const query = `DELETE FROM lectures WHERE id = ?`;
  db.query(query, [lectureId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Lecture deleted successfully" });
  });
});

module.exports = router;
