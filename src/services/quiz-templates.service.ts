import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface QuizQuestion {
  questionText: string;
  questionType: 'multiple_choice' | 'essay' | 'short_answer';
  choices?: string[];
  answerText: string;
  points: number;
}

export interface CreateQuizTemplateDto {
  title: string;
  description?: string;
  subject: string;
  gradeLevels: number[];
  questions: QuizQuestion[];
  durationMinutes?: number;
  randomizeQuestions?: boolean;
}

export interface UpdateQuizTemplateDto {
  title?: string;
  description?: string;
  questions?: QuizQuestion[];
  durationMinutes?: number;
  randomizeQuestions?: boolean;
}

export interface QuizTemplate {
  id: string;
  title: string;
  description?: string;
  subject: string;
  gradeLevels: number[];
  authorId: string;
  questions: QuizQuestion[];
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export const quizTemplatesService = {
  async create(data: CreateQuizTemplateDto): Promise<QuizTemplate> {
    const response = await axios.post(`${API_URL}/quiz-templates`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAll(): Promise<QuizTemplate[]> {
    const response = await axios.get(`${API_URL}/quiz-templates`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string): Promise<QuizTemplate> {
    const response = await axios.get(`${API_URL}/quiz-templates/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async update(id: string, data: UpdateQuizTemplateDto): Promise<QuizTemplate> {
    const response = await axios.patch(
      `${API_URL}/quiz-templates/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/quiz-templates/${id}`, {
      withCredentials: true,
    });
  },
};
