export interface Student {
  id: number;
  name: string;
}

// Value is now the amount paid, not a boolean
export interface PaymentStatus {
  [week: number]: number; 
}

export interface Payments {
  [studentId: number]: PaymentStatus;
}

// Data structure to be encoded in the URL hash
export interface SharedState {
  w: number; // weekCount
  r: number; // requiredAmount
  p: Payments; // payments
  s: Student[]; // students
}