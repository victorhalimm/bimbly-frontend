import { defineStore } from 'pinia';
import {
  bookingService,
  type Booking,
  type BookingFilters,
  type CreateBookingData,
  type BookingStatus,
} from '@/services/booking.service';

export interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  filters: BookingFilters;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    bookings: [],
    selectedBooking: null,
    filters: {
      page: 1,
      limit: 20,
    },
    meta: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    loading: false,
    error: null,
  }),

  getters: {
    hasBookings: (state) => state.bookings.length > 0,
    hasMorePages: (state) => state.meta.page < state.meta.totalPages,
    pendingBookings: (state) =>
      state.bookings.filter((b) => b.status === 'pending_payment'),
    confirmedBookings: (state) =>
      state.bookings.filter((b) => b.status === 'confirmed'),
    completedBookings: (state) =>
      state.bookings.filter((b) => b.status === 'completed'),
    cancelledBookings: (state) =>
      state.bookings.filter((b) => b.status === 'cancelled'),
    upcomingBookings: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.bookings.filter(
        (b) =>
          (b.status === 'confirmed' || b.status === 'pending_payment') &&
          b.bookingDate >= today,
      );
    },
    pastBookings: (state) => {
      const today = new Date().toISOString().split('T')[0];
      return state.bookings.filter(
        (b) => b.status === 'completed' || b.bookingDate < today,
      );
    },
  },

  actions: {
    async fetchBookings(newFilters?: Partial<BookingFilters>) {
      this.loading = true;
      this.error = null;

      try {
        if (newFilters) {
          this.filters = { ...this.filters, ...newFilters };
        }

        const response = await bookingService.getBookings(this.filters);
        this.bookings = response.data;
        this.meta = response.meta;
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to fetch bookings';
        this.bookings = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchBookingById(bookingId: string) {
      this.loading = true;
      this.error = null;

      try {
        this.selectedBooking = await bookingService.getBookingById(bookingId);
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to fetch booking';
        this.selectedBooking = null;
      } finally {
        this.loading = false;
      }
    },

    async createBooking(data: CreateBookingData) {
      this.loading = true;
      this.error = null;

      try {
        const booking = await bookingService.createBooking(data);
        this.bookings.unshift(booking);
        return booking;
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to create booking';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async confirmBooking(bookingId: string, meetingUrl?: string) {
      this.loading = true;
      this.error = null;

      try {
        const booking = await bookingService.confirmBooking(bookingId, meetingUrl);
        this.updateBookingInList(booking);
        if (this.selectedBooking?.bookingId === bookingId) {
          this.selectedBooking = booking;
        }
        return booking;
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to confirm booking';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cancelBooking(bookingId: string, reason: string) {
      this.loading = true;
      this.error = null;

      try {
        const booking = await bookingService.cancelBooking(bookingId, reason);
        this.updateBookingInList(booking);
        if (this.selectedBooking?.bookingId === bookingId) {
          this.selectedBooking = booking;
        }
        return booking;
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to cancel booking';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async completeBooking(bookingId: string) {
      this.loading = true;
      this.error = null;

      try {
        const booking = await bookingService.completeBooking(bookingId);
        this.updateBookingInList(booking);
        if (this.selectedBooking?.bookingId === bookingId) {
          this.selectedBooking = booking;
        }
        return booking;
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to complete booking';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async studentCompleteBooking(bookingId: string) {
      this.loading = true;
      this.error = null;

      try {
        const booking = await bookingService.studentCompleteBooking(bookingId);
        this.updateBookingInList(booking);
        if (this.selectedBooking?.bookingId === bookingId) {
          this.selectedBooking = booking;
        }
        return booking;
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to complete booking';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async checkAvailability(
      tutorId: string,
      date: string,
      startTime: string,
      durationHours: number,
    ) {
      try {
        return await bookingService.checkAvailability(
          tutorId,
          date,
          startTime,
          durationHours,
        );
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        this.error = error.response?.data?.message || error.message || 'Failed to check availability';
        throw error;
      }
    },

    updateBookingInList(updatedBooking: Booking) {
      const index = this.bookings.findIndex(
        (b) => b.bookingId === updatedBooking.bookingId,
      );
      if (index !== -1) {
        this.bookings[index] = updatedBooking;
      }
    },

    setPage(page: number) {
      this.filters.page = page;
      this.fetchBookings();
    },

    setStatusFilter(status?: BookingStatus) {
      this.filters.status = status;
      this.filters.page = 1;
      this.fetchBookings();
    },

    resetFilters() {
      this.filters = {
        page: 1,
        limit: 20,
      };
    },

    clearError() {
      this.error = null;
    },

    clearSelectedBooking() {
      this.selectedBooking = null;
    },

    
  },
});
