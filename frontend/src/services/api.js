import axios from "axios";

const API_URL = "https://luct-reporting-dkk1.onrender.com"; // your backend

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically include JWT token in requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auth services
export const authService = {
  login: (credentials) => api.post("/api/auth/login", credentials), // expects { email, password }
  register: (userData) => api.post("/api/auth/register", userData), // expects { email, password, full_name, role }
  getCurrentUser: () => JSON.parse(localStorage.getItem("user")),
  logout: () => localStorage.removeItem("user"),
};

// ✅ Lecture services
export const lectureService = {
  getLectures: () => api.get("/api/lectures"),
  getLectureById: (id) => api.get(`/api/lectures/id/${id}`),
  getLecturesByCourse: (courseId) => api.get(`/api/lectures/course/${courseId}`),
  createLecture: (lectureData) => api.post("/api/lectures", lectureData),
  updateLecture: (id, lectureData) => api.put(`/api/lectures/${id}`, lectureData),
  deleteLecture: (id) => api.delete(`/api/lectures/${id}`),
};

// ✅ Rating services
export const ratingService = {
  submitRating: (ratingData) => api.post("/api/ratings", ratingData),
  getRatingsByLecture: (lectureId) => api.get(`/api/ratings/lecture/${lectureId}`),
  getAverageRating: (lectureId) => api.get(`/api/ratings/lecture/${lectureId}/average`),
};

// ✅ Course services
export const courseService = {
  getCourses: () => api.get("/api/courses"),
  getCourseById: (id) => api.get(`/api/courses/${id}`),
  createCourse: (courseData) => api.post("/api/courses", courseData),
  updateCourse: (id, courseData) => api.put(`/api/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
};

// ✅ Report services
export const reportService = {
  getReports: () => api.get("/api/reports"),
  getReportById: (id) => api.get(`/api/reports/${id}`),
  createReport: (reportData) => api.post("/api/reports", reportData),
  updateReport: (id, reportData) => api.put(`/api/reports/${id}`, reportData),
  deleteReport: (id) => api.delete(`/api/reports/${id}`),
  addPRLFeedback: (lectureId, data) => api.put(`/api/reports/${lectureId}/feedback`, data),
};
