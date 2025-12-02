import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface SaveAnswerDto {
  assignmentId: string;
  questionIndex: number;
  studentAnswer: string;
}

export interface GradeAnswerDto {
  pointsEarned: number;
  tutorFeedback?: string;
}

export interface StudentAnswer {
  id: string;
  assignmentId: string;
  questionIndex: number;
  questionText: string;
  questionType: string;
  questionChoices?: string[];
  correctAnswer: string;
  questionPoints: number;
  studentAnswer: string;
  isCorrect?: boolean;
  pointsEarned: number;
  tutorFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export const studentAnswersService = {
  async save(data: SaveAnswerDto): Promise<StudentAnswer> {
    const response = await axios.post(`${API_URL}/student-answers`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAllByAssignment(assignmentId: string): Promise<StudentAnswer[]> {
    const response = await axios.get(
      `${API_URL}/student-answers/assignment/${assignmentId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async grade(assignmentId: string, questionIndex: number, data: GradeAnswerDto): Promise<StudentAnswer> {
    const response = await axios.patch(
      `${API_URL}/student-answers/grade?assignmentId=${assignmentId}&questionIndex=${questionIndex}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },
};
