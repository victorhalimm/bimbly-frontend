import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface SubtopicScores {
  [subtopic: string]: number;
}

export interface CreateAcademicReportDto {
  grade: number;
  subjectId: string;
  subtopicScores: SubtopicScores;
}

export interface UpdateAcademicReportDto {
  subtopicScores: SubtopicScores;
}

export interface AcademicReport {
  id: string;
  studentId: string;
  grade: number;
  subjectId: string;
  subject: {
    id: string;
    name: string;
  };
  subtopicScores: SubtopicScores;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumTemplate {
  curriculum: string;
  grade: number;
  subjects: Array<{
    name: string;
    subtopics: string[];
  }>;
}

export const academicReportsService = {
  async create(data: CreateAcademicReportDto): Promise<AcademicReport> {
    const response = await axios.post(`${API_URL}/academic-reports`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async getAll(): Promise<AcademicReport[]> {
    const response = await axios.get(`${API_URL}/academic-reports`, {
      withCredentials: true,
    });
    return response.data;
  },

  async update(id: string, data: UpdateAcademicReportDto): Promise<AcademicReport> {
    const response = await axios.patch(
      `${API_URL}/academic-reports/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/academic-reports/${id}`, {
      withCredentials: true,
    });
  },

  async getCurriculumTemplate(
    curriculum: string,
    grade: number,
  ): Promise<CurriculumTemplate> {
    const response = await axios.get(
      `${API_URL}/academic-reports/curriculum-templates`,
      {
        params: { curriculum, grade },
        withCredentials: true,
      },
    );
    return response.data;
  },
};
