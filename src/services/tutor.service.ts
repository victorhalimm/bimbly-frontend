import axios from 'axios';
import type { TeachingMethod } from './booking.service';

const API_URL = import.meta.env.VITE_API_URL;

export interface TutorSearchFilters {
  subject?: string;
  gradeLevel?: number;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  teachingMethod?: TeachingMethod;
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
  teachingMethods: TeachingMethod[];
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
  fullName: string;
  profileImageUrl?: string;
  city: string;
  province: string;
  bio: string;
  educationBackground: string;
  teachingExperienceYears: number;
  specializations?: string[];
  subjects: string[];
  gradeLevels: number[];
  teachingMethods: TeachingMethod[];
  hourlyRate: number;
  certifications?: { name: string; fileUrl: string }[];
  availabilitySchedule?: { start: string; end: string; dayOfWeek: number }[];
  averageRating: number;
  totalReviews: number;
  totalSessions: number;
  isApproved?: boolean;
  createdAt?: string;
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

export interface AvailableSlotsResponse {
  date: string;
  dayOfWeek: string;
  slots: TimeSlot[];
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

  async getAvailableSlots(tutorId: string, date: string): Promise<AvailableSlotsResponse> {
    const response = await axios.get(`${API_URL}/tutors/${tutorId}/available-slots`, {
      params: { date },
    });
    return response.data;
  },

  async submitApplication() {
    const response = await axios.post(
      `${API_URL}/tutors/profile/submit-application`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  async getApplicationStatus() {
    try {
      const response = await axios.get(
        `${API_URL}/tutors/application/status`,
        {
          withCredentials: true,
          validateStatus: (status) => status === 200 || status === 404
        }
      );

      if (response.status === 404) {
        throw { response: { status: 404, data: { message: 'No application found' } } };
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw error;
      }
      throw error;
    }
  },

  async getProfile() {
    const response = await axios.get(`${API_URL}/tutors/profile`, {
      withCredentials: true,
    });
    return response.data;
  },

  async uploadCertification(file: File, certificationName: string) {
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
