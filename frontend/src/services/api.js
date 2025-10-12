import axios from 'axios';

const API_URL = 'https://luct-reporting-dkk1.onrender.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
};

// Lecture services
export const lectureService = {
  getLectures: () => api.get('/lectures'),
  getLectureById: (id) => api.get(`/lectures/${id}`),
  getLecturesByCourse: (courseId) => api.get(`/lectures/course/${courseId}`),
  createLecture: (lectureData) => api.post('/lectures', lectureData),
  updateLecture: (id, lectureData) => api.put(`/lectures/${id}`, lectureData),
  deleteLecture: (id) => api.delete(`/lectures/${id}`),
  getAverageRating: (lectureId) => api.get(`/ratings/${lectureId}/average`),
};

// Rating services
export const ratingService = {
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  getRatingsByLecture: (lectureId) => api.get(`/ratings/${lectureId}`),
  getAverageRating: (lectureId) => api.get(`/ratings/${lectureId}/average`),
};

// Course services
export const courseService = {
  getCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Report services
export const reportService = {
  getReports: () => api.get('/reports'),
  getReportById: (id) => api.get(`/reports/${id}`),
  createReport: (reportData) => api.post('/reports', reportData),
  updateReport: (id, reportData) => api.put(`/reports/${id}`, reportData),
  deleteReport: (id) => api.delete(`/reports/${id}`),

  // ✅ PRL adds feedback for a lecture
  addPRLFeedback: (lectureId, data) => api.put(`/reports/${lectureId}/feedback`, data),
};
