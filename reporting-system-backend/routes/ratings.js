const express = require('express');
const API_URL = process.env.REACT_APP_API_URL;
const router = express.Router();
const {
  submitRating,
  getRatingsByLecture,
  getAverageRating
} = require('../controllers/ratingController');

// Submit a rating
router.post('/', submitRating);

// Get all ratings for a lecture
router.get('/lecture/:lectureId', getRatingsByLecture);

// Get average rating for a lecture
router.get('/lecture/:lectureId/average', getAverageRating);

module.exports = router;
