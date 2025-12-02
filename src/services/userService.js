import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const userService = {
  async updateProfile(data) {
    const response = await axios.patch(`${API_URL}/users/profile`, data, {
      withCredentials: true,
    });
    return response.data;
  },
};
