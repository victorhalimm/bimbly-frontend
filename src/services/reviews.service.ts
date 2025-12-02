import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  reviewText?: string;
}

export interface RespondReviewDto {
  response: string;
}

export interface Review {
  id: string;
  bookingId: string;
  tutorId: string;
  studentId: string;
  rating: number;
  reviewText?: string;
  tutorResponse?: string;
  tutorRespondedAt?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    fullName: string;
  };
  tutor?: {
    fullName: string;
  };
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    averageRating: number;
    totalReviews: number;
  };
}

export const reviewsService = {
  async create(data: CreateReviewDto): Promise<Review> {
    const response = await axios.post(`${API_URL}/reviews`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getByTutor(
    tutorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ReviewsResponse> {
    const response = await axios.get(`${API_URL}/reviews/tutor/${tutorId}`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  },

  async getByBooking(bookingId: string): Promise<Review> {
    const response = await axios.get(
      `${API_URL}/reviews/booking/${bookingId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async respond(id: string, data: RespondReviewDto): Promise<Review> {
    const response = await axios.patch(
      `${API_URL}/reviews/${id}/respond`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/reviews/${id}`, {
      withCredentials: true,
    });
  },
};
