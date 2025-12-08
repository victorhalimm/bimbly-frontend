import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateSessionSummaryDto {
  bookingId: string;
  strengths: string;
  areasForImprovement: string;
  notes?: string;
  homeworkAssigned?: string;
  nextSessionPlan?: string;
}

export interface UpdateSessionSummaryDto {
  strengths?: string;
  areasForImprovement?: string;
  notes?: string;
  homeworkAssigned?: string;
  nextSessionPlan?: string;
}

export interface SessionSummary {
  id: string;
  bookingId: string;
  booking?: any;
  strengths: string;
  areasForImprovement: string;
  notes?: string;
  homeworkAssigned?: string;
  nextSessionPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export const sessionSummariesService = {
  async create(data: CreateSessionSummaryDto): Promise<SessionSummary> {
    const response = await axios.post(`${API_URL}/session-summaries`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getByBooking(bookingId: string): Promise<SessionSummary> {
    const response = await axios.get(
      `${API_URL}/session-summaries/booking/${bookingId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async getByStudent(studentId: string): Promise<SessionSummary[]> {
    const response = await axios.get(
      `${API_URL}/session-summaries/student/${studentId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async getByTutor(tutorId: string): Promise<SessionSummary[]> {
    const response = await axios.get(
      `${API_URL}/session-summaries/tutor/${tutorId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async update(id: string, data: UpdateSessionSummaryDto): Promise<SessionSummary> {
    const response = await axios.patch(
      `${API_URL}/session-summaries/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/session-summaries/${id}`, {
      withCredentials: true,
    });
  },
};
