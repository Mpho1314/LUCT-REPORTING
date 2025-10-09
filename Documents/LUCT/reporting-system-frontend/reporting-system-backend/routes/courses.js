const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // ✅ correct path
const {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

// Routes
router.get('/', getCourses);
router.post('/', addCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
