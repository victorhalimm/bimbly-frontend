import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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

  async getUserById(id: string) {
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

  async getAllApplications(status: string | null = null) {
    const params = status ? { status } : {};
    const response = await axios.get(`${API_URL}/admin/tutor-applications`, {
      params,
      withCredentials: true,
    });
    return response.data;
  },

  async getApplicationById(id: string) {
    const response = await axios.get(`${API_URL}/admin/tutor-applications/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async approveApplication(id: string) {
    const response = await axios.patch(
      `${API_URL}/admin/tutor-applications/${id}/approve`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  async rejectApplication(id: string, rejectionReason: string) {
    const response = await axios.patch(
      `${API_URL}/admin/tutor-applications/${id}/reject`,
      { rejectionReason },
      { withCredentials: true }
    );
    return response.data;
  },

  async requestAdditionalInfo(id: string, requestMessage: string) {
    const response = await axios.post(
      `${API_URL}/admin/tutor-applications/${id}/request-info`,
      { requestMessage },
      { withCredentials: true }
    );
    return response.data;
  },

  async getTutorApplications(status: string | null = null) {
    return this.getAllApplications(status);
  },

  async blockUser(userId: string, blockReason: string) {
    const response = await axios.patch(
      `${API_URL}/admin/users/${userId}/block`,
      { blockReason },
      { withCredentials: true }
    );
    return response.data;
  },

  async unblockUser(userId: string) {
    const response = await axios.patch(
      `${API_URL}/admin/users/${userId}/unblock`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },
};
