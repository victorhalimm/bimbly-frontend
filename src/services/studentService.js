import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const studentService = {
  async getProfile() {
    const response = await axios.get(`${API_URL}/students/profile`, {
      withCredentials: true,
    });
    return response.data;
  },

  async createProfile(data) {
    const response = await axios.post(`${API_URL}/students/profile`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateProfile(data) {
    const response = await axios.patch(`${API_URL}/students/profile`, data, {
      withCredentials: true,
    });
    return response.data;
  },
};
