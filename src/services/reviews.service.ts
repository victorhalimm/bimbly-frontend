import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const reviewsService = {
  async create(data: {
    bookingId: string;
    tutorId: string;
    rating: number;
    reviewText?: string;
  }) {
    const response = await axios.post(
      `${API_URL}/reviews`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async getByTutor(
    tutorId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      order?: 'ASC' | 'DESC';
    },
  ) {
    const response = await axios.get(`${API_URL}/reviews/tutor/${tutorId}`, {
      params,
      withCredentials: true,
    });
    return response.data;
  },

  async getByBooking(bookingId: string) {
    const response = await axios.get(`${API_URL}/reviews/booking/${bookingId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axios.get(`${API_URL}/reviews/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async respond(id: string, response: string) {
    const res = await axios.patch(
      `${API_URL}/reviews/${id}/respond`,
      { response },
      { withCredentials: true },
    );
    return res.data;
  },

  async delete(id: string) {
    const response = await axios.delete(`${API_URL}/reviews/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
