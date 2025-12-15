import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export type TeachingMethod = 'online' | 'offline';

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface BookingUser {
  id: string;
  fullName: string;
  profileImageUrl: string | null;
}

export interface Booking {
  bookingId: string;
  student: BookingUser;
  tutor: BookingUser;
  subject: string;
  subtopic: string | null;
  gradeLevel: number;
  teachingMethod: TeachingMethod;
  bookingDate: string;
  startTime: string;
  durationHours: number;
  hourlyRate: number;
  totalPrice: number;
  status: BookingStatus;
  location: string | null;
  meetingUrl: string | null;
  cancellationReason: string | null;
  tutorCompleted: boolean;
  studentCompleted: boolean;
  tutorCompletedAt: string | null;
  studentCompletedAt: string | null;
}

export interface CreateBookingData {
  tutorId: string;
  subject: string;
  subtopic?: string;
  gradeLevel: number;
  teachingMethod: TeachingMethod;
  bookingDate: string;
  startTime: string;
  durationHours: number;
  location?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface BookingListResponse {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

export const bookingService = {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await axios.post(`${API_URL}/bookings`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getBookings(filters: BookingFilters = {}): Promise<BookingListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const response = await axios.get(`${API_URL}/bookings?${params.toString()}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async confirmBooking(
    bookingId: string,
    meetingUrl?: string,
  ): Promise<Booking> {
    const response = await axios.patch(
      `${API_URL}/bookings/${bookingId}/confirm`,
      { meetingUrl },
      { withCredentials: true },
    );
    return response.data;
  },

  async cancelBooking(bookingId: string, reason: string): Promise<Booking> {
    const response = await axios.patch(
      `${API_URL}/bookings/${bookingId}/cancel`,
      { reason },
      { withCredentials: true },
    );
    return response.data;
  },

  async completeBooking(bookingId: string): Promise<Booking> {
    const response = await axios.patch(
      `${API_URL}/bookings/${bookingId}/complete`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },

  async studentCompleteBooking(bookingId: string): Promise<Booking> {
    const response = await axios.patch(
      `${API_URL}/bookings/${bookingId}/student-complete`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },

  async checkAvailability(
    tutorId: string,
    date: string,
    startTime: string,
    durationHours: number,
  ): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
      date,
      startTime,
      durationHours: String(durationHours),
    });
    const response = await axios.get(
      `${API_URL}/bookings/check-availability/${tutorId}?${params.toString()}`,
      { withCredentials: true },
    );
    return response.data;
  },
};
