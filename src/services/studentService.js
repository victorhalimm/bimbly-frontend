import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const studentService = {
  async getProfile() {
    const response = await axios.get(`${API_URL}/students/profile`, {
      withCredentials: true,
    });
    return response.data;
  },
};
