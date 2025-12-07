import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const userService = {
  async updateProfile(data: any) {
    const response = await axios.patch(`${API_URL}/users/profile`, data, {
      withCredentials: true,
    });
    return response.data;
  },
};
