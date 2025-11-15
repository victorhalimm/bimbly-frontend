import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const studentAnswersService = {
  async saveAnswer(assignmentId: string, answer: { problemId: string; studentAnswer: string }) {
    const response = await axios.post(
      `${API_URL}/student-answers`,
      { assignmentId, answer },
      { withCredentials: true },
    );
    return response.data;
  },

  async getByAssignment(assignmentId: string) {
    const response = await axios.get(`${API_URL}/student-answers/assignment/${assignmentId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async gradeAnswer(id: string, data: { pointsEarned: number; tutorFeedback?: string }) {
    const response = await axios.patch(
      `${API_URL}/student-answers/${id}/grade`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },
};
