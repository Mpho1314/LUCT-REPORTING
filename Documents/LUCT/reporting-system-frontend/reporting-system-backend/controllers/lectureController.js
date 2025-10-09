const db = require('../db/connection');

// Lecturer submits a report
exports.submitLecture = (req, res) => {
  const {
    course_id,
    lecturer_id,
    date,
    week,
    topic,
    outcomes,
    students_present,
    students_registered,
    attendance,
    venue,
    scheduled_time,
    recommendations,
    faculty_name,
    class_name,
    course_code
  } = req.body;

  const query = `
    INSERT INTO lectures
    (faculty_name, class_name, course_id, lecturer_id, date, scheduled_time, course_code,
     week, topic, outcomes, students_present, students_registered, attendance, venue, recommendations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
    attendance || "", // optional
    venue,
    recommendations || "" // optional
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting lecture:", err);
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ message: "Lecture report submitted successfully", lectureId: result.insertId });
  });
};

// Get all lectures for a course
exports.getLecturesByCourse = (req, res) => {
  const courseId = req.params.courseId;

  const query = `
    SELECT l.*, u.username AS lecturer_name
    FROM lectures l
    JOIN users u ON l.lecturer_id = u.id
    WHERE l.course_id = ?
    ORDER BY l.date DESC
  `;

  db.query(query, [courseId], (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get single lecture by ID with PRL feedback
exports.getLectureById = (req, res) => {
  const lectureId = req.params.lectureId;
  const query = `
    SELECT l.*, r.prl_feedback, u.username AS lecturer_name
    FROM lectures l
    LEFT JOIN reports r ON l.id = r.lecture_id
    JOIN users u ON l.lecturer_id = u.id
    WHERE l.id = ?
  `;
  db.query(query, [lectureId], (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

// Get all lectures
exports.getAllLectures = (req, res) => {
  const query = `
    SELECT l.*, u.username AS lecturer_name
    FROM lectures l
    JOIN users u ON l.lecturer_id = u.id
  `;
  db.query(query, (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
