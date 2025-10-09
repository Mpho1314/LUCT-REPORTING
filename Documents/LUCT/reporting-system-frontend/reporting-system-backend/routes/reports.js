const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // ✅ DB connection

// ✅ PRL adds feedback for a lecture
router.put('/:lectureId/feedback', async (req, res) => {
    const { lectureId } = req.params;
    const { prl_feedback } = req.body;

    if (!prl_feedback) {
        return res.status(400).json({ error: "Feedback is required" });
    }

    try {
        const query = `
            UPDATE reports
            SET prl_feedback = ?, status = 'completed'
            WHERE lecture_id = ?
        `;
        db.query(query, [prl_feedback, lectureId], (err, result) => {
            if (err) {
                console.error(`Error adding feedback for lecture ${lectureId}:`, err);
                return res.status(500).json({
                    error: "Failed to add feedback",
                    details: err.sqlMessage
                });
            }

            if (result.affectedRows === 0) {
                // If no report exists yet, insert it
                const insertQuery = `
                    INSERT INTO reports (lecture_id, prl_feedback, status)
                    VALUES (?, ?, 'completed')
                `;
                db.query(insertQuery, [lectureId, prl_feedback], (insertErr, insertResult) => {
                    if (insertErr) {
                        console.error("Error inserting new report with feedback:", insertErr);
                        return res.status(500).json({ error: "Failed to add feedback" });
                    }
                    return res.status(201).json({ 
                        message: "Feedback added successfully", 
                        reportId: insertResult.insertId 
                    });
                });
            } else {
                res.status(200).json({ message: "Feedback updated successfully" });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add feedback" });
    }
});

// ✅ Lecturer submits a report (starts as pending)
router.post("/", (req, res) => {
    const { lecture_id } = req.body;

    if (!lecture_id) {
        return res.status(400).json({ error: "lecture_id is required" });
    }

    const query = `
        INSERT INTO reports (lecture_id, status)
        VALUES (?, 'pending')
    `;
    db.query(query, [lecture_id], (err, result) => {
        if (err) {
            console.error("Error inserting report:", err);
            return res.status(500).json({
                error: "Failed to submit report",
                details: err.sqlMessage
            });
        }
        res.status(201).json({
            message: "Report submitted successfully (pending)",
            reportId: result.insertId
        });
    });
});

// ✅ Get all reports (with status)
router.get("/", (req, res) => {
    const query = `
        SELECT r.id, r.prl_feedback, r.status, r.lecture_id,
               l.topic AS lecture_topic, l.date AS lecture_date,
               c.name AS course_name, u.username AS lecturer_name
        FROM reports r
        JOIN lectures l ON r.lecture_id = l.id
        JOIN courses c ON l.course_id = c.id
        JOIN users u ON l.lecturer_id = u.id
        ORDER BY r.id DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching reports:", err);
            return res.status(500).json({
                error: "Failed to fetch reports",
                details: err.sqlMessage
            });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
