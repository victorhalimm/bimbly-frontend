import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  email: string;
  fullName: string;
  userType: 'student' | 'tutor' | 'admin';
  phoneNumber: string;
  profileImageUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    isStudent: (state) => state.user?.userType === 'student',
    isTutor: (state) => state.user?.userType === 'tutor',
    isAdmin: (state) => state.user?.userType === 'admin',
    userName: (state) => state.user?.fullName || '',
  },

  actions: {
    async register(userData: {
      email: string;
      password: string;
      fullName: string;
      phoneNumber: string;
      userType: 'student' | 'tutor';
    }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(userData);
        return response;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials: { email: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(credentials);
        this.user = response.user;
        this.isAuthenticated = true;
        return response;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async fetchCurrentUser() {
      try {
        const user = await authService.getCurrentUser();
        this.user = user;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async verifyEmail(token: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.verifyEmail(token);
        return response;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Email verification failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.forgotPassword(email);
        return response;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Password reset request failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.resetPassword(token, newPassword);
        return response;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Password reset failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
