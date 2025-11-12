import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const userService = {
  async getProfile() {
    const response = await axios.get(`${API_URL}/users/profile`, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateProfile(data) {
    const response = await axios.patch(`${API_URL}/users/profile`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async uploadAvatar(base64Image) {
    const response = await axios.post(
      `${API_URL}/users/upload-avatar`,
      { base64Image },
      { withCredentials: true }
    );
    return response.data;
  },
};
