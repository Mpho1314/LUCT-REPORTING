const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const lectureRoutes = require('./routes/lectures');
const courseRoutes = require('./routes/courses');
const reportRoutes = require('./routes/reports');
const ratingsRouter = require("./routes/ratings");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/ratings", ratingsRouter);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
