import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

export const reportService = {
  // Get all reports
  getReports: async () => {
    try {
      const response = await axios.get(API_URL);
      return response;
    } catch (err) {
      console.error("Error fetching reports:", err);
      throw err;
    }
  },

  // Add PRL feedback for a lecture (PUT request)
  addPRLFeedback: async (lectureId, data) => {
    try {
      // data = { prl_feedback: "Your feedback text" }
      const response = await axios.put(`${API_URL}/${lectureId}`, data);
      return response;
    } catch (err) {
      console.error(`Error adding PRL feedback for lecture ${lectureId}:`, err);
      throw err;
    }
  }
};
