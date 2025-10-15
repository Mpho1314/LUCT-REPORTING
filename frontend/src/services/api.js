import axios from 'axios';

const API_URL = 'https://luct-reporting-dkk1.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Include JWT token automatically
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

// ✅ Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const data = response.data;

    // Store user in localStorage
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: data.id,
        username: data.username,
        token: data.token,
        role: data.role || 'student',
      })
    );

    return data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ✅ Lecture services
export const lectureService = {
  getLectures: () => api.get('/api/lectures'),
  getLectureById: (id) => api.get(`/api/lectures/id/${id}`),
  getLecturesByCourse: (courseId) => api.get(`/api/lectures/course/${courseId}`),
  createLecture: (lectureData) => api.post('/api/lectures', lectureData),
  updateLecture: (id, lectureData) => api.put(`/api/lectures/${id}`, lectureData),
  deleteLecture: (id) => api.delete(`/api/lectures/${id}`),
};

// ✅ Rating services
export const ratingService = {
  submitRating: (ratingData) => api.post('/api/ratings', ratingData),
  getRatingsByLecture: (lectureId) => api.get(`/api/ratings/lecture/${lectureId}`),
  getAverageRating: (lectureId) => api.get(`/api/ratings/lecture/${lectureId}/average`),
};

// ✅ Course services
export const courseService = {
  getCourses: () => api.get('/api/courses'),
  getCourseById: (id) => api.get(`/api/courses/${id}`),
  createCourse: (courseData) => api.post('/api/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/api/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
};

// ✅ Report services
export const reportService = {
  getReports: () => api.get('/api/reports'),
  getReportById: (id) => api.get(`/api/reports/${id}`),
  createReport: (reportData) => api.post('/api/reports', reportData),
  updateReport: (id, reportData) => api.put(`/api/reports/${id}`, reportData),
  deleteReport: (id) => api.delete(`/api/reports/${id}`),
  addPRLFeedback: (lectureId, data) => api.put(`/api/reports/${lectureId}/feedback`, data),
};
