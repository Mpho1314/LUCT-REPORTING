const db = require('../db/connection');

// Submit a rating
exports.submitRating = (req, res) => {
  const { lecture_id, student_id, rating, comment } = req.body;

  const query = `
    INSERT INTO ratings (lecture_id, student_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [lecture_id, student_id, rating, comment], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Rating submitted successfully', ratingId: result.insertId });
  });
};

// Get all ratings for a lecture
exports.getRatingsByLecture = (req, res) => {
  const lectureId = req.params.lectureId;

  const query = `
    SELECT r.*, u.username AS student_name
    FROM ratings r
    JOIN users u ON r.student_id = u.id
    WHERE r.lecture_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(query, [lectureId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get average rating for a lecture
exports.getAverageRating = (req, res) => {
  const lectureId = req.params.lectureId;

  const query = `
    SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_ratings
    FROM ratings
    WHERE lecture_id = ?
  `;

  db.query(query, [lectureId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};
