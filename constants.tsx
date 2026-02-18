
import React from 'react';
import { User, Room, Complaint, UserRole, ComplaintStatus, ComplaintPriority } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.j@university.edu',
  role: UserRole.ADMIN,
  roomNumber: 'A-302',
  block: 'A'
};

export const MOCK_ROOMS: Room[] = [
  { id: 'r1', number: '101', block: 'A', capacity: 2, occupancy: 2, type: 'DOUBLE', status: 'FULL', features: ['AC', 'Attached Washroom'] },
  { id: 'r2', number: '102', block: 'A', capacity: 2, occupancy: 1, type: 'DOUBLE', status: 'AVAILABLE', features: ['Non-AC'] },
  { id: 'r3', number: '201', block: 'B', capacity: 1, occupancy: 0, type: 'SINGLE', status: 'AVAILABLE', features: ['AC', 'Balcony'] },
  { id: 'r4', number: '202', block: 'B', capacity: 3, occupancy: 3, type: 'TRIPLE', status: 'FULL', features: ['Non-AC'] },
  { id: 'r5', number: '301', block: 'C', capacity: 2, occupancy: 0, type: 'DOUBLE', status: 'MAINTENANCE', features: ['AC'] },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    studentId: 's101',
    studentName: 'Sarah Smith',
    roomNumber: 'A-101',
    category: 'Electrical',
    description: 'Ceiling fan is making a clicking noise and rotating slowly.',
    status: ComplaintStatus.IN_PROGRESS,
    priority: ComplaintPriority.MEDIUM,
    createdAt: '2024-05-15T10:30:00Z',
    updatedAt: '2024-05-16T09:00:00Z'
  },
  {
    id: 'c2',
    studentId: 's102',
    studentName: 'Mike Ross',
    roomNumber: 'B-204',
    category: 'Plumbing',
    description: 'Severe water leakage in the bathroom from the flush tank.',
    status: ComplaintStatus.PENDING,
    priority: ComplaintPriority.CRITICAL,
    createdAt: '2024-05-18T14:20:00Z',
    updatedAt: '2024-05-18T14:20:00Z'
  },
  {
    id: 'c3',
    studentId: 's103',
    studentName: 'Emily Blunt',
    roomNumber: 'C-305',
    category: 'Furniture',
    description: 'Study table drawer is broken.',
    status: ComplaintStatus.RESOLVED,
    priority: ComplaintPriority.LOW,
    createdAt: '2024-05-10T08:00:00Z',
    updatedAt: '2024-05-12T11:00:00Z',
    feedback: 'Excellent response time!',
    rating: 5
  }
];

export const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Housekeeping', 'Internet', 'Others'];
