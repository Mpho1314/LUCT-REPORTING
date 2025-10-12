const db = require('../db/connection');

// ✅ PRL adds feedback and marks report as completed
exports.addPRLFeedback = (req, res) => {
  const lectureId = req.params.lectureId;
  const { prl_feedback } = req.body;

  if (!prl_feedback) {
    return res.status(400).json({ error: "prl_feedback is required" });
  }

  // Check if report exists for this lecture
  db.query("SELECT * FROM reports WHERE lecture_id = ?", [lectureId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      // ✅ Update existing report with feedback + mark as completed
      db.query(
        "UPDATE reports SET prl_feedback = ?, status = 'completed' WHERE lecture_id = ?",
        [prl_feedback, lectureId],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ message: "Feedback updated successfully and report marked as completed ✅" });
        }
      );
    } else {
      // ✅ Insert a new report (directly completed if feedback is given)
      db.query(
        "INSERT INTO reports (lecture_id, prl_feedback, status) VALUES (?, ?, 'completed')",
        [lectureId, prl_feedback],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ message: "Feedback added successfully and report marked as completed ✅" });
        }
      );
    }
  });
};
