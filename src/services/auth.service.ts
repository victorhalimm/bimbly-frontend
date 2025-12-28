import axios from 'axios';
import type { AvailabilitySchedule } from '@/types/availability';
import type { TeachingMethod } from './booking.service';

const API_URL = import.meta.env.VITE_API_URL;

interface StudentProfileData {
  currentGrade: number;
  schoolName: string;
  address?: string;
}

interface CertificationData {
  name: string;
  fileData: string;
}

interface TutorProfileData {
  bio: string;
  educationBackground: string;
  teachingExperienceYears: number;
  specializations?: string[];
  subjects: string[];
  gradeLevels: number[];
  teachingMethods: TeachingMethod[];
  hourlyRate: number;
  availabilitySchedule?: AvailabilitySchedule;
  certifications?: CertificationData[];
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
    city: string;
    province: string;
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
    city: string;
    province: string;
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

  async resetPassword(currentPassword: string, newPassword: string) {
    const response = await axios.post(
      `${API_URL}/auth/reset-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  },
