// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import routes
const authRoutes = require('./routes/auth');
const lectureRoutes = require('./routes/lectures');
const courseRoutes = require('./routes/courses');
const reportRoutes = require('./routes/reports');
const ratingsRouter = require('./routes/ratings');

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS config for frontend
app.use(cors({
    origin: process.env.FRONTEND_URL, // e.g., https://luct-reporting-system.vercel.app
    credentials: true
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ratings', ratingsRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
