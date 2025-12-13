import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface StudentProfileData {
  currentGrade: number;
  schoolName: string;
  city: string;
  province: string;
  address?: string;
}

interface TutorProfileData {
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
}

export const authService = {
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    userType: 'student' | 'tutor';
  }) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  async registerStudent(userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    studentProfile: StudentProfileData;
  }) {
    const response = await axios.post(`${API_URL}/auth/register/student`, userData);
    return response.data;
  },

  async registerTutor(userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    tutorProfile: TutorProfileData;
  }) {
    const response = await axios.post(`${API_URL}/auth/register/tutor`, userData);
    return response.data;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true,
    });
    return response.data;
  },

  async logout() {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async getCurrentUser() {
    const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await axios.post(`${API_URL}/auth/verify-email`, {
      token,
    });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  },
};
