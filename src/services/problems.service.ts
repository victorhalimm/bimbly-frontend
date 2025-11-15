import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const problemsService = {
  async create(data: {
    questionText: string;
    answerText: string;
    questionType: 'multiple_choice' | 'essay' | 'short_answer';
    choices?: string[];
    points?: number;
  }) {
    const response = await axios.post(
      `${API_URL}/problems`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async getAll() {
    const response = await axios.get(`${API_URL}/problems`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axios.get(`${API_URL}/problems/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async update(id: string, data: {
    questionText?: string;
    answerText?: string;
    questionType?: 'multiple_choice' | 'essay' | 'short_answer';
    choices?: string[];
    points?: number;
  }) {
    const response = await axios.patch(
      `${API_URL}/problems/${id}`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async delete(id: string) {
    const response = await axios.delete(`${API_URL}/problems/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
