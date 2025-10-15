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
const allowedOrigins = [
  'https://luct-reporting-u5ik.vercel.app', // your current frontend
  'https://luct-reporting-git-main-mpho-esther-qabas-projects.vercel.app' // optional: old frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
// ✅ Test root route to verify backend is alive
app.get('/', (req, res) => {
  res.send('LUCT Reporting API is running ✅');
});

// server.js (add this ABOVE app.listen)
app.get('/api/test-db', async (req, res) => {
  try {
    // Simple query to check database connection
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Backend and DB are working!', result: rows[0].result });
  } catch (error) {
    console.error('DB test error:', error);
    res.status(500).json({ message: 'DB connection failed' });
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Backend and DB are working!', result: rows[0].result });
  } catch (error) {
    console.error('DB test error:', error);
    res.status(500).json({ message: 'DB connection failed', error: error.message });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
