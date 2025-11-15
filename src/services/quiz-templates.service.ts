import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const quizTemplatesService = {
  async create(data: {
    title: string;
    description?: string;
    subject: string;
    gradeLevels: number[];
    problemIds: string[];
    durationMinutes?: number;
    isPublic?: boolean;
  }) {
    const response = await axios.post(
      `${API_URL}/quiz-templates`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async getAll() {
    const response = await axios.get(`${API_URL}/quiz-templates`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axios.get(`${API_URL}/quiz-templates/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async update(id: string, data: {
    title?: string;
    description?: string;
    subject?: string;
    gradeLevels?: number[];
    problemIds?: string[];
    durationMinutes?: number;
    isPublic?: boolean;
  }) {
    const response = await axios.patch(
      `${API_URL}/quiz-templates/${id}`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async togglePublic(id: string) {
    const response = await axios.post(
      `${API_URL}/quiz-templates/${id}/toggle-public`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },

  async delete(id: string) {
    const response = await axios.delete(`${API_URL}/quiz-templates/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
