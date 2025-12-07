import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const studentService = {
  async getProfile() {
    const response = await axios.get(`${API_URL}/students/profile`, {
      withCredentials: true,
    });
    return response.data;
  },
};
