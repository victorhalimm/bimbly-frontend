import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const sessionSummariesService = {
  async create(data: {
    bookingId: string;
    strengths: string;
    areasForImprovement: string;
    notes?: string;
    homeworkAssigned?: string;
    nextSessionPlan?: string;
  }) {
    const response = await axios.post(
      `${API_URL}/session-summaries`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async getByBooking(bookingId: string) {
    const response = await axios.get(`${API_URL}/session-summaries/booking/${bookingId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getByStudent(studentId: string) {
    const response = await axios.get(`${API_URL}/session-summaries/student/${studentId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getByTutor(tutorId: string) {
    const response = await axios.get(`${API_URL}/session-summaries/tutor/${tutorId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axios.get(`${API_URL}/session-summaries/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async update(id: string, data: {
    strengths?: string;
    areasForImprovement?: string;
    notes?: string;
    homeworkAssigned?: string;
    nextSessionPlan?: string;
  }) {
    const response = await axios.patch(
      `${API_URL}/session-summaries/${id}`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async delete(id: string) {
    const response = await axios.delete(`${API_URL}/session-summaries/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
