export type UserType = 'worker' | 'employer';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  createdAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  country: string;
  countryCode: string;
  headline: string;
  skills: string[];
  hourlyRateMin: number;
  hourlyRateMax: number;
  availabilityHours: number;
  availabilityType: 'part-time' | 'full-time';
  bio: string;
  lastActive: string;
  isVerified: boolean;
  reviewCount: number;
  averageRating: number;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  avatar?: string;
  country: string;
  countryCode: string;
  bio: string;
  createdAt: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  skills: string[];
  hourlyRateMin: number;
  hourlyRateMax: number;
  availabilityHours: number;
  countryPreference: string | null;
  createdAt: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  workerId: string;
  employerId: string;
  employerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  workerId: string;
  employerId: string;
  workerName: string;
  employerName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface SavedWorker {
  id: string;
  employerId: string;
  workerId: string;
  savedAt: string;
}

export interface FilterState {
  search: string;
  country: string;
  minRate: number;
  maxRate: number;
  minHours: number;
  maxHours: number;
  verifiedOnly: boolean;
  lastActive: 'any' | 'today' | 'week' | 'month';
  skills: string[];
}
