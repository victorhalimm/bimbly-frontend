import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface TutorSearchFilters {
  subject?: string;
  gradeLevel?: number;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  teachingMethod?: 'online' | 'offline';
  minRating?: number;
  name?: string;
  sortBy?: 'rating' | 'price' | 'experience' | 'sessions';
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface TutorListItem {
  id: string;
  userId: string;
  fullName: string;
  profileImageUrl: string | null;
  bio: string;
  subjects: string[];
  gradeLevels: number[];
  teachingMethods: ('online' | 'offline')[];
  hourlyRate: number;
  city: string;
  province: string;
  averageRating: number;
  totalReviews: number;
  totalSessions: number;
  teachingExperienceYears: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TutorSearchResponse {
  data: TutorListItem[];
  meta: PaginationMeta;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string;
  educationBackground: string;
  teachingExperienceYears: number;
  specializations?: string[];
  subjects: string[];
  gradeLevels: number[];
  teachingMethods: ('online' | 'offline')[];
  hourlyRate: number;
  city: string;
  province: string;
  certifications?: { name: string; fileUrl: string }[];
  availabilitySchedule?: Record<string, { start: string; end: string }[]>;
  averageRating: number;
  totalReviews: number;
  totalSessions: number;
  isApproved: boolean;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImageUrl: string | null;
  };
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  date: string;
  dayOfWeek: string;
  availableSlots: TimeSlot[];
}

export interface ReviewItem {
  id: string;
  studentName: string;
  rating: number;
  reviewText: string;
  tutorResponse: string | null;
  createdAt: string;
}

export interface ReviewsResponse {
  data: ReviewItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    averageRating: number;
  };
}

export const tutorService = {
  async searchTutors(filters: TutorSearchFilters = {}): Promise<TutorSearchResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`${API_URL}/tutors?${params.toString()}`);
    return response.data;
  },

  async getTutorById(id: string): Promise<TutorProfile> {
    const response = await axios.get(`${API_URL}/tutors/${id}`);
    return response.data;
  },

  async getTutorReviews(
    id: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ReviewsResponse> {
    const response = await axios.get(`${API_URL}/tutors/${id}/reviews`, {
      params: { page, limit },
    });
    return response.data;
  },

  async getTutorAvailability(id: string, date?: string): Promise<AvailabilityResponse> {
    const params: Record<string, string> = {};
    if (date) {
      params.date = date;
    }
    const response = await axios.get(`${API_URL}/tutors/${id}/availability`, { params });
    return response.data;
  },
};
