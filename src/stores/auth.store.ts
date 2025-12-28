import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';
import { useTutorStore } from './tutor.store';
import { useStudentStore } from './student.store';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  userType: 'student' | 'tutor' | 'admin';
  phoneNumber: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: AuthUser | null;
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

        if (response.user.userType === 'tutor') {
          const tutorStore = useTutorStore();
          await tutorStore.fetchCurrentUserProfile();
        } else if (response.user.userType === 'student') {
          const studentStore = useStudentStore();
          await studentStore.fetchCurrentUserProfile();
        }

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
        const tutorStore = useTutorStore();
        const studentStore = useStudentStore();
        tutorStore.clearCurrentUserProfile();
        studentStore.clearCurrentUserProfile();
      }
    },

    async fetchCurrentUser() {
      try {
        const user = await authService.getCurrentUser();
        this.user = user;
        this.isAuthenticated = true;

        if (user.userType === 'tutor') {
          const tutorStore = useTutorStore();
          await tutorStore.fetchCurrentUserProfile();
        } else if (user.userType === 'student') {
          const studentStore = useStudentStore();
          await studentStore.fetchCurrentUserProfile();
        }
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async resetPassword(currentPassword: string, newPassword: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.resetPassword(currentPassword, newPassword);
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
