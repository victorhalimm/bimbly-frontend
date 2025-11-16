import { defineStore } from 'pinia';
import quizAssignmentsService from '@/services/quiz-assignments.service';
import studentAnswersService from '@/services/student-answers.service';

type QuizStatus = 'assigned' | 'in_progress' | 'submitted' | 'graded';

interface QuizTemplate {
  id: string;
  title: string;
  description?: string;
  totalPoints: number;
  durationMinutes?: number;
  problemIds?: string[];
}

interface Student {
  id: string;
  user: {
    fullName: string;
  };
}

interface Tutor {
  id: string;
  user: {
    fullName: string;
  };
}

interface Problem {
  id: string;
  questionText: string;
  questionType: string;
  points: number;
}

interface StudentAnswer {
  id: string;
  assignmentId: string;
  problem: Problem;
  questionText: string;
  studentAnswer: string;
  isCorrect: boolean | null;
  pointsEarned: number;
  tutorFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

interface QuizAssignment {
  id: string;
  quizTemplate: QuizTemplate;
  quizTemplateId?: string;
  student?: Student;
  tutor?: Tutor;
  studentId?: string;
  tutorId?: string;
  sessionId?: string;
  assignedAt: string;
  deadline?: string;
  startedAt?: string;
  submittedAt?: string;
  score?: number;
  status: QuizStatus;
  createdAt: string;
  updatedAt: string;
}

interface QuizResults {
  assignment: QuizAssignment;
  answers: StudentAnswer[];
  score: number;
}

interface QuizAssignmentsState {
  assignments: QuizAssignment[];
  currentAssignment: QuizAssignment | null;
  currentAnswers: StudentAnswer[];
  quizResults: QuizResults | null;
  isLoading: boolean;
  error: string | null;
}

export const useQuizAssignmentsStore = defineStore('quizAssignments', {
  state: (): QuizAssignmentsState => ({
    assignments: [],
    currentAssignment: null,
    currentAnswers: [],
    quizResults: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getAssignmentById: (state) => (id: string) => {
      return state.assignments.find((assignment) => assignment.id === id);
    },

    assignedQuizzes: (state): QuizAssignment[] => {
      return state.assignments.filter((a) => a.status === 'assigned');
    },

    inProgressQuizzes: (state): QuizAssignment[] => {
      return state.assignments.filter((a) => a.status === 'in_progress');
    },

    submittedQuizzes: (state): QuizAssignment[] => {
      return state.assignments.filter((a) => a.status === 'submitted');
    },

    gradedQuizzes: (state): QuizAssignment[] => {
      return state.assignments.filter((a) => a.status === 'graded');
    },

    pendingGrading: (state): QuizAssignment[] => {
      return state.assignments.filter((a) => a.status === 'submitted');
    },
  },

  actions: {
    async createAssignment(data: {
      quizTemplateId: string;
      studentId: string;
      sessionId?: string;
      deadline?: string;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizAssignmentsService.create(data);
        this.assignments.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create assignment';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAssignments() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizAssignmentsService.getAll();
        this.assignments = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch assignments';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAssignmentById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizAssignmentsService.getById(id);
        this.currentAssignment = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch assignment';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async startQuiz(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizAssignmentsService.start(id);
        const index = this.assignments.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.assignments[index] = response.data;
        }
        this.currentAssignment = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to start quiz';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveAnswer(assignmentId: string, answer: {
      problemId: string;
      studentAnswer: string;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await studentAnswersService.saveAnswer(assignmentId, answer);
        const index = this.currentAnswers.findIndex(
          (a) => a.problem.id === answer.problemId
        );
        if (index === -1) {
          this.currentAnswers.push(response.data);
        } else {
          this.currentAnswers[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to save answer';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async submitQuiz(id: string, answers: Array<{
      problemId: string;
      studentAnswer: string;
    }>) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizAssignmentsService.submit(id, { answers });
        const index = this.assignments.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.assignments[index] = response.data;
        }
        this.currentAssignment = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to submit quiz';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchQuizResults(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await quizAssignmentsService.getResults(id);
        this.quizResults = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch results';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAnswersByAssignment(assignmentId: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await studentAnswersService.getByAssignment(assignmentId);
        this.currentAnswers = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch answers';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async gradeAnswer(answerId: string, data: {
      pointsEarned: number;
      tutorFeedback?: string;
    }) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await studentAnswersService.grade(answerId, data);
        const index = this.currentAnswers.findIndex((a) => a.id === answerId);
        if (index !== -1) {
          this.currentAnswers[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to grade answer';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    clearCurrentAssignment() {
      this.currentAssignment = null;
      this.currentAnswers = [];
    },

    clearQuizResults() {
      this.quizResults = null;
    },
  },
});
