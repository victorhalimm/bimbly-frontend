export interface StudentProfile {
  id: string;
  userId: string;
  currentGrade: number;
  schoolName: string;
  city: string;
  province: string;
  address?: string;
}

export const studentService: {
  getProfile(): Promise<StudentProfile>;
};
