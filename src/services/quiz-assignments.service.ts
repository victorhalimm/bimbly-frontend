import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const quizAssignmentsService = {
  async create(data: {
    quizTemplateId: string;
    studentId: string;
    sessionId?: string;
    deadline?: string;
  }) {
    const response = await axios.post(
      `${API_URL}/quiz-assignments`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async getAll() {
    const response = await axios.get(`${API_URL}/quiz-assignments`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axios.get(`${API_URL}/quiz-assignments/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async start(id: string) {
    const response = await axios.patch(
      `${API_URL}/quiz-assignments/${id}/start`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },

  async submit(id: string, answers: Array<{ problemId: string; studentAnswer: string }>) {
    const response = await axios.post(
      `${API_URL}/quiz-assignments/${id}/submit`,
      { answers },
      { withCredentials: true },
    );
    return response.data;
  },

  async getResults(id: string) {
    const response = await axios.get(`${API_URL}/quiz-assignments/${id}/results`, {
      withCredentials: true,
    });
    return response.data;
  },
};
