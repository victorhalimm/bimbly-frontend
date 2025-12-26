import type { TeachingMethod } from '@/services/booking.service';

export interface FilterData {
  subject?: string;
  gradeLevel?: number;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  teachingMethod?: TeachingMethod;
  minRating?: number;
}
