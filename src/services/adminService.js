import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const adminService = {
  async getStats() {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAllUsers() {
    const response = await axios.get(`${API_URL}/admin/users`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getUserById(id) {
    const response = await axios.get(`${API_URL}/admin/users/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAllTutors() {
    const response = await axios.get(`${API_URL}/admin/tutors`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAllApplications(status = null) {
    const params = status ? { status } : {};
    const response = await axios.get(`${API_URL}/admin/tutor-applications`, {
      params,
      withCredentials: true,
    });
    return response.data;
  },

  async getApplicationById(id) {
    const response = await axios.get(`${API_URL}/admin/tutor-applications/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async approveApplication(id) {
    const response = await axios.patch(
      `${API_URL}/admin/tutor-applications/${id}/approve`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  async rejectApplication(id, rejectionReason) {
    const response = await axios.patch(
      `${API_URL}/admin/tutor-applications/${id}/reject`,
      { rejectionReason },
      { withCredentials: true }
    );
    return response.data;
  },
};
