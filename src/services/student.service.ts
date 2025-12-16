import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface TutoredStudent {
  id: string;
  fullName: string;
}

export const studentService = {
  async getProfile() {
    const response = await axios.get(`${API_URL}/students/profile`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getTutoredStudents(): Promise<TutoredStudent[]> {
    const response = await axios.get(`${API_URL}/students/tutored`, {
      withCredentials: true,
    });
    return response.data;
  },
};
