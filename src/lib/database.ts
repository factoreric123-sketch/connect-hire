// Database service - Currently using mock data since no Supabase tables are set up
// This file provides stub functions that return empty data to prevent type errors

import { supabase } from '@/integrations/supabase/client';

// Worker Profile Operations - Stubbed
export const workerService = {
  async getAll(filters?: any) {
    console.warn('Database tables not set up - using mock data');
    return [];
  },

  async getById(id: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async getByUserId(userId: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async create(profile: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async update(id: string, profile: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async updateByUserId(userId: string, profile: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },
};

// Employer Profile Operations - Stubbed
export const employerService = {
  async getById(id: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async getByUserId(userId: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async create(profile: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async update(id: string, profile: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async updateByUserId(userId: string, profile: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },
};

// Job Operations - Stubbed
export const jobService = {
  async getAll(filters?: any) {
    console.warn('Database tables not set up - using mock data');
    return [];
  },

  async getById(id: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async getByEmployerId(employerId: string) {
    console.warn('Database tables not set up - using mock data');
    return [];
  },

  async create(job: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async update(id: string, job: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async delete(id: string) {
    console.warn('Database tables not set up - using mock data');
  },
};

// Review Operations - Stubbed
export const reviewService = {
  async getByWorkerId(workerId: string) {
    console.warn('Database tables not set up - using mock data');
    return [];
  },

  async create(review: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },
};

// Conversation Operations - Stubbed
export const conversationService = {
  async getByUserId(userId: string, userType: 'worker' | 'employer') {
    console.warn('Database tables not set up - using mock data');
    return [];
  },

  async getOrCreate(workerId: string, employerId: string) {
    console.warn('Database tables not set up - using mock data');
    return { id: 'mock-conversation' };
  },

  async getById(id: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },
};

// Message Operations - Stubbed
export const messageService = {
  async getByConversationId(conversationId: string) {
    console.warn('Database tables not set up - using mock data');
    return [];
  },

  async create(message: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async markAsRead(conversationId: string, userId: string) {
    console.warn('Database tables not set up - using mock data');
  },

  subscribeToConversation(conversationId: string, callback: (message: any) => void) {
    console.warn('Database tables not set up - using mock data');
    return supabase.channel(`conversation:${conversationId}`);
  },
};

// Saved Workers Operations - Stubbed
export const savedWorkerService = {
  async getByEmployerId(employerId: string) {
    console.warn('Database tables not set up - using mock data');
    return [];
  },

  async save(employerId: string, workerId: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async unsave(employerId: string, workerId: string) {
    console.warn('Database tables not set up - using mock data');
  },

  async isSaved(employerId: string, workerId: string) {
    console.warn('Database tables not set up - using mock data');
    return false;
  },
};

// User Profile Operations - Stubbed
export const userProfileService = {
  async create(profile: any) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },

  async getById(id: string) {
    console.warn('Database tables not set up - using mock data');
    return null;
  },
};
