import { Student } from './types';

export const DEFAULT_WEEK_COUNT = 8;
export const MAX_WEEKS = 52;
export const DEFAULT_REQUIRED_AMOUNT = 20; // Default amount in Baht

export const INITIAL_STUDENTS: Student[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `นักเรียนคนที่ ${i + 1}`,
}));