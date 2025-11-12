import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const tutorService = {
  async getProfile() {
    const response = await axios.get(`${API_URL}/tutors/profile`, {
      withCredentials: true,
    });
    return response.data;
  },

  async createProfile(data) {
    const response = await axios.post(`${API_URL}/tutors/profile`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateProfile(data) {
    const response = await axios.patch(`${API_URL}/tutors/profile`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async uploadCertification(file, certificationName) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('certificationName', certificationName);

    const response = await axios.post(
      `${API_URL}/tutors/upload-certification`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
