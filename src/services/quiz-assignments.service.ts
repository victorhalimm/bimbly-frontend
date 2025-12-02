import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateQuizAssignmentDto {
  quizTemplateId: string;
  studentId: string;
  sessionId?: string;
  deadline?: string;
}

export interface QuizAssignment {
  id: string;
  quizTemplateId: string;
  studentId: string;
  tutorId: string;
  sessionId?: string;
  assignedAt: string;
  deadline?: string;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  status: 'assigned' | 'in_progress' | 'submitted' | 'graded';
  createdAt: string;
  updatedAt: string;
  quizTemplate?: any;
  student?: any;
  tutor?: any;
}

export const quizAssignmentsService = {
  async create(data: CreateQuizAssignmentDto): Promise<QuizAssignment> {
    const response = await axios.post(`${API_URL}/quiz-assignments`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAllByStudent(): Promise<QuizAssignment[]> {
    const response = await axios.get(`${API_URL}/quiz-assignments/student`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAllByTutor(): Promise<QuizAssignment[]> {
    const response = await axios.get(`${API_URL}/quiz-assignments/tutor`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string): Promise<QuizAssignment> {
    const response = await axios.get(`${API_URL}/quiz-assignments/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async startQuiz(id: string): Promise<QuizAssignment> {
    const response = await axios.patch(
      `${API_URL}/quiz-assignments/${id}/start`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async submitQuiz(id: string): Promise<QuizAssignment> {
    const response = await axios.post(
      `${API_URL}/quiz-assignments/${id}/submit`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

};
