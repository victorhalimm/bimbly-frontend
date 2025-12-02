import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const subjectsService = {
  async getAll() {
    const response = await axios.get(`${API_URL}/subjects`, {
      withCredentials: true,
    });
    return response.data;
  },

  async create(name: string) {
    const response = await axios.post(
      `${API_URL}/subjects`,
      { name },
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async seedSubjects() {
    const response = await axios.post(
      `${API_URL}/subjects/seed`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  },
};
