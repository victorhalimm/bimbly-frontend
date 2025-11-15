import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const academicReportsService = {
  async getAll() {
    const response = await axios.get(`${API_URL}/academic-reports`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axios.get(`${API_URL}/academic-reports/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async create(data: {
    grade: number;
    subjectId: string;
    subtopicScores: Record<string, number>;
  }) {
    const response = await axios.post(
      `${API_URL}/academic-reports`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async update(id: string, data: { subtopicScores: Record<string, number> }) {
    const response = await axios.patch(
      `${API_URL}/academic-reports/${id}`,
      data,
      { withCredentials: true },
    );
    return response.data;
  },

  async delete(id: string) {
    const response = await axios.delete(`${API_URL}/academic-reports/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getCurriculumTemplates(curriculum: string, grade: number) {
    const response = await axios.get(`${API_URL}/curriculum-templates`, {
      params: { curriculum, grade },
      withCredentials: true,
    });
    return response.data;
  },
};
