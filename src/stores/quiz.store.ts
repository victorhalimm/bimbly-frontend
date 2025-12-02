import { defineStore } from 'pinia';
import {
  quizTemplatesService,
  type QuizTemplate,
  type CreateQuizTemplateDto,
  type UpdateQuizTemplateDto,
} from '../services/quiz-templates.service';
import {
  quizAssignmentsService,
  type QuizAssignment,
  type CreateQuizAssignmentDto,
} from '../services/quiz-assignments.service';
import {
  studentAnswersService,
  type StudentAnswer,
  type SaveAnswerDto,
  type GradeAnswerDto,
} from '../services/student-answers.service';

export interface QuizState {
  templates: QuizTemplate[];
  assignments: QuizAssignment[];
  answers: StudentAnswer[];
  currentAssignment: QuizAssignment | null;
  loading: boolean;
  error: string | null;
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    templates: [],
    assignments: [],
    answers: [],
    currentAssignment: null,
    loading: false,
    error: null,
  }),

  getters: {
    templateById: (state) => (id: string) => {
      return state.templates.find((t) => t.id === id);
    },
    assignmentById: (state) => (id: string) => {
      return state.assignments.find((a) => a.id === id);
    },
    answersByAssignment: (state) => (assignmentId: string) => {
      return state.answers.filter((a) => a.assignmentId === assignmentId);
    },
    studentAssignments: (state) => {
      return state.assignments.filter((a) => a.status !== 'graded');
    },
    tutorAssignments: (state) => {
      return state.assignments.filter((a) => a.status === 'submitted');
    },
  },

  actions: {
    async createTemplate(data: CreateQuizTemplateDto) {
      this.loading = true;
      this.error = null;
      try {
        const template = await quizTemplatesService.create(data);
        this.templates.push(template);
        return template;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTemplates() {
      this.loading = true;
      this.error = null;
      try {
        this.templates = await quizTemplatesService.getAll();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch quizzes';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTemplate(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const template = await quizTemplatesService.getOne(id);
        const index = this.templates.findIndex((t) => t.id === id);
        if (index === -1) {
          this.templates.push(template);
        } else {
          this.templates[index] = template;
        }
        return template;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTemplate(id: string, data: UpdateQuizTemplateDto) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await quizTemplatesService.update(id, data);
        const index = this.templates.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.templates[index] = updated;
        }
        return updated;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTemplate(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await quizTemplatesService.delete(id);
        this.templates = this.templates.filter((t) => t.id !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async assignQuiz(data: CreateQuizAssignmentDto) {
      this.loading = true;
      this.error = null;
      try {
        const assignment = await quizAssignmentsService.create(data);
        this.assignments.push(assignment);
        return assignment;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to assign quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStudentAssignments() {
      this.loading = true;
      this.error = null;
      try {
        this.assignments = await quizAssignmentsService.getAllByStudent();
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Failed to fetch assignments';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTutorAssignments() {
      this.loading = true;
      this.error = null;
      try {
        this.assignments = await quizAssignmentsService.getAllByTutor();
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Failed to fetch assignments';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAssignment(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.currentAssignment = await quizAssignmentsService.getOne(id);
        const index = this.assignments.findIndex((a) => a.id === id);
        if (index === -1) {
          this.assignments.push(this.currentAssignment);
        } else {
          this.assignments[index] = this.currentAssignment;
        }
        return this.currentAssignment;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || 'Failed to fetch assignment';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async startQuiz(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const assignment = await quizAssignmentsService.startQuiz(id);
        const index = this.assignments.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.assignments[index] = assignment;
        }
        this.currentAssignment = assignment;
        return assignment;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to start quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitQuiz(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const assignment = await quizAssignmentsService.submitQuiz(id);
        const index = this.assignments.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.assignments[index] = assignment;
        }
        this.currentAssignment = assignment;
        return assignment;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to submit quiz';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async saveAnswer(data: SaveAnswerDto) {
      try {
        const answer = await studentAnswersService.save(data);
        const index = this.answers.findIndex(
          (a) =>
            a.assignmentId === answer.assignmentId &&
            a.questionIndex === answer.questionIndex,
        );
        if (index === -1) {
          this.answers.push(answer);
        } else {
          this.answers[index] = answer;
        }
        return answer;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to save answer';
        throw error;
      }
    },

    async fetchAnswers(assignmentId: string) {
      this.loading = true;
      this.error = null;
      try {
        const answers = await studentAnswersService.getAllByAssignment(
          assignmentId,
        );
        this.answers = this.answers.filter(
          (a) => a.assignmentId !== assignmentId,
        );
        this.answers.push(...answers);
        return answers;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch answers';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async gradeAnswer(assignmentId: string, questionIndex: number, data: GradeAnswerDto) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await studentAnswersService.grade(assignmentId, questionIndex, data);
        const index = this.answers.findIndex(
          (a) => a.assignmentId === assignmentId && a.questionIndex === questionIndex
        );
        if (index !== -1) {
          this.answers[index] = updated;
        }
        return updated;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to grade answer';
        throw error;
      } finally {
        this.loading = false;
      }
    },

  },
});
