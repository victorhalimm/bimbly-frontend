import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateReviewDto {
  tutorId: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
}

export interface RatingDistribution {
  star: number;
  count: number;
}

export interface ReviewStudent {
  fullName: string;
  profileImageUrl: string | null;
}

export interface Review {
  reviewTitle: string;
  reviewText: string | null;
  rating: number;
  createdAt: string;
  student: ReviewStudent;
}

export interface ReviewsMeta {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewsResponse {
  data: Review[];
  meta: ReviewsMeta;
}

export type SortBy = 'newest' | 'oldest' | 'highest' | 'lowest';

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
    sortBy: SortBy = 'newest',
    rating?: number | null,
  ): Promise<ReviewsResponse> {
    const params: Record<string, any> = { page, limit, sortBy };
    if (rating !== null && rating !== undefined) {
      params.rating = rating;
    }
    const response = await axios.get(`${API_URL}/reviews/tutor/${tutorId}`, {
      params,
      withCredentials: true,
    });
    return response.data;
  },

  async checkReview(tutorUserId: string): Promise<{ hasReviewed: boolean }> {
    const response = await axios.get(`${API_URL}/reviews/check/${tutorUserId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
