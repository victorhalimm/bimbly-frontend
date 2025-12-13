export interface FilterData {
  subject?: string;
  gradeLevel?: number;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  teachingMethod?: 'online' | 'offline';
  minRating?: number;
}
