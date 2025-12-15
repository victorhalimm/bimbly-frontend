import { defineStore } from 'pinia';
import { adminService } from '../services/admin.service';

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  approvedTutors: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userType: 'student' | 'tutor' | 'admin';
  isBlocked: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TutorApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  additionalInfoRequested: boolean;
  requestedAt: string | null;
  tutorProfile: {
    id: string;
    subjects: string[];
    teachingExperienceYears: number;
    updatedAt: string;
    user: {
      fullName: string;
      email: string;
    };
  };
}

export interface AdminState {
  stats: AdminStats;
  users: User[];
  applications: TutorApplication[];
  loading: boolean;
  loadingUsers: boolean;
  loadingApplications: boolean;
  error: string | null;
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    stats: {
      totalUsers: 0,
      totalStudents: 0,
      totalTutors: 0,
      approvedTutors: 0,
      pendingApplications: 0,
      rejectedApplications: 0,
      totalBookings: 0,
      totalRevenue: 0,
    },
    users: [],
    applications: [],
    loading: false,
    loadingUsers: false,
    loadingApplications: false,
    error: null,
  }),

  getters: {
    pendingApplications: (state) => {
      return state.applications.filter((app) => app.status === 'pending');
    },
    approvedApplications: (state) => {
      return state.applications.filter((app) => app.status === 'approved');
    },
    rejectedApplications: (state) => {
      return state.applications.filter((app) => app.status === 'rejected');
    },
    pendingCount: (state) => {
      return state.applications.filter((app) => app.status === 'pending').length;
    },
    activeUsers: (state) => {
      return state.users.filter((user) => !user.isBlocked);
    },
    blockedUsers: (state) => {
      return state.users.filter((user) => user.isBlocked);
    },
    approvalRate: (state) => {
      if (state.stats.totalTutors === 0) return 0;
      return ((state.stats.approvedTutors / state.stats.totalTutors) * 100).toFixed(1);
    },
  },

  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        this.stats = await adminService.getStats();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch stats';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUsers() {
      this.loadingUsers = true;
      this.error = null;
      try {
        this.users = await adminService.getAllUsers();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
        throw error;
      } finally {
        this.loadingUsers = false;
      }
    },

    async fetchApplications(status: string | null = null) {
      this.loadingApplications = true;
      this.error = null;
      try {
        this.applications = await adminService.getAllApplications(status);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch applications';
        throw error;
      } finally {
        this.loadingApplications = false;
      }
    },

    async approveApplication(id: string) {
      this.error = null;
      try {
        await adminService.approveApplication(id);
        const index = this.applications.findIndex((app) => app.id === id);
        if (index !== -1) {
          this.applications[index].status = 'approved';
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to approve application';
        throw error;
      }
    },

    async rejectApplication(id: string, reason: string) {
      this.error = null;
      try {
        await adminService.rejectApplication(id, reason);
        const index = this.applications.findIndex((app) => app.id === id);
        if (index !== -1) {
          this.applications[index].status = 'rejected';
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to reject application';
        throw error;
      }
    },

    async requestAdditionalInfo(id: string, message: string) {
      this.error = null;
      try {
        await adminService.requestAdditionalInfo(id, message);
        const index = this.applications.findIndex((app) => app.id === id);
        if (index !== -1) {
          this.applications[index].additionalInfoRequested = true;
          this.applications[index].requestedAt = new Date().toISOString();
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to request additional info';
        throw error;
      }
    },

    async blockUser(userId: string, reason: string) {
      this.error = null;
      try {
        await adminService.blockUser(userId, reason);
        const index = this.users.findIndex((user) => user.id === userId);
        if (index !== -1) {
          this.users[index].isBlocked = true;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to block user';
        throw error;
      }
    },

    async unblockUser(userId: string) {
      this.error = null;
      try {
        await adminService.unblockUser(userId);
        const index = this.users.findIndex((user) => user.id === userId);
        if (index !== -1) {
          this.users[index].isBlocked = false;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to unblock user';
        throw error;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
