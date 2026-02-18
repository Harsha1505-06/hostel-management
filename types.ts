
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  MAINTENANCE = 'MAINTENANCE'
}

export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  block?: string;
}

export interface Room {
  id: string;
  number: string;
  block: string;
  capacity: number;
  occupancy: number;
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  status: 'AVAILABLE' | 'FULL' | 'MAINTENANCE';
  features: string[];
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  updatedAt: string;
  feedback?: string;
  rating?: number;
}

export interface AllocationRequest {
  id: string;
  studentId: string;
  preferences: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
}

export type ViewType = 'DASHBOARD' | 'ROOMS' | 'COMPLAINTS' | 'ALLOCATIONS' | 'ANALYTICS' | 'PROFILE';
