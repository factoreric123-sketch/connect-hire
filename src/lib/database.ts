import { supabase } from '@/integrations/supabase/client';
import { Database } from './database.types';
import { WorkerProfile, EmployerProfile, Job, Review, Conversation, Message } from '@/types';

type WorkerProfileRow = Database['public']['Tables']['worker_profiles']['Row'];
type EmployerProfileRow = Database['public']['Tables']['employer_profiles']['Row'];
type JobRow = Database['public']['Tables']['jobs']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type MessageRow = Database['public']['Tables']['messages']['Row'];

// Worker Profile Operations
export const workerService = {
  async getAll(filters?: {
    country?: string;
    minRate?: number;
    maxRate?: number;
    minHours?: number;
    maxHours?: number;
    verifiedOnly?: boolean;
    skills?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('worker_profiles')
      .select('*')
      .order('last_active', { ascending: false });

    if (filters) {
      if (filters.country && filters.country !== 'all') {
        query = query.eq('country_code', filters.country);
      }
      if (filters.minRate !== undefined) {
        query = query.gte('hourly_rate_max', filters.minRate);
      }
      if (filters.maxRate !== undefined) {
        query = query.lte('hourly_rate_min', filters.maxRate);
      }
      if (filters.minHours !== undefined) {
        query = query.gte('availability_hours', filters.minHours);
      }
      if (filters.maxHours !== undefined) {
        query = query.lte('availability_hours', filters.maxHours);
      }
      if (filters.verifiedOnly) {
        query = query.eq('is_verified', true);
      }
      if (filters.skills && filters.skills.length > 0) {
        query = query.overlaps('skills', filters.skills);
      }
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,headline.ilike.%${filters.search}%`
        );
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WorkerProfileRow[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('worker_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as WorkerProfileRow;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('worker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data as WorkerProfileRow;
  },

  async create(profile: Database['public']['Tables']['worker_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('worker_profiles')
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data as WorkerProfileRow;
  },

  async update(id: string, profile: Database['public']['Tables']['worker_profiles']['Update']) {
    const { data, error } = await supabase
      .from('worker_profiles')
      .update({ ...profile, last_active: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as WorkerProfileRow;
  },

  async updateByUserId(userId: string, profile: Database['public']['Tables']['worker_profiles']['Update']) {
    const { data, error } = await supabase
      .from('worker_profiles')
      .update({ ...profile, last_active: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as WorkerProfileRow;
  },
};

// Employer Profile Operations
export const employerService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('employer_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as EmployerProfileRow;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('employer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data as EmployerProfileRow;
  },

  async create(profile: Database['public']['Tables']['employer_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('employer_profiles')
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data as EmployerProfileRow;
  },

  async update(id: string, profile: Database['public']['Tables']['employer_profiles']['Update']) {
    const { data, error } = await supabase
      .from('employer_profiles')
      .update(profile)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as EmployerProfileRow;
  },

  async updateByUserId(userId: string, profile: Database['public']['Tables']['employer_profiles']['Update']) {
    const { data, error } = await supabase
      .from('employer_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as EmployerProfileRow;
  },
};

// Job Operations
export const jobService = {
  async getAll(filters?: {
    skills?: string;
    search?: string;
    sortBy?: 'newest' | 'rate-high' | 'rate-low';
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer:employer_profiles(company_name)
      `)
      .eq('is_active', true);

    if (filters) {
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }
      if (filters.skills) {
        query = query.contains('skills', [filters.skills]);
      }

      // Apply sorting
      if (filters.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filters.sortBy === 'rate-high') {
        query = query.order('hourly_rate_max', { ascending: false });
      } else if (filters.sortBy === 'rate-low') {
        query = query.order('hourly_rate_min', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer:employer_profiles(company_name)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByEmployerId(employerId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as JobRow[];
  },

  async create(job: Database['public']['Tables']['jobs']['Insert']) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    if (error) throw error;
    return data as JobRow;
  },

  async update(id: string, job: Database['public']['Tables']['jobs']['Update']) {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as JobRow;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Review Operations
export const reviewService = {
  async getByWorkerId(workerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        employer:employer_profiles(company_name)
      `)
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(review: Database['public']['Tables']['reviews']['Insert']) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    if (error) throw error;
    return data as ReviewRow;
  },
};

// Conversation Operations
export const conversationService = {
  async getByUserId(userId: string, userType: 'worker' | 'employer') {
    const { data: profile, error: profileError } = await supabase
      .from(userType === 'worker' ? 'worker_profiles' : 'employer_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        worker:worker_profiles(name),
        employer:employer_profiles(company_name)
      `)
      .or(
        userType === 'worker'
          ? `worker_id.eq.${profile.id}`
          : `employer_id.eq.${profile.id}`
      )
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrCreate(workerId: string, employerId: string) {
    // Try to get existing conversation
    const { data: existing, error: getError } = await supabase
      .from('conversations')
      .select('*')
      .eq('worker_id', workerId)
      .eq('employer_id', employerId)
      .single();

    if (existing) return existing as ConversationRow;

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({ worker_id: workerId, employer_id: employerId })
      .select()
      .single();

    if (error) throw error;
    return data as ConversationRow;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        worker:worker_profiles(name),
        employer:employer_profiles(company_name)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};

// Message Operations
export const messageService = {
  async getByConversationId(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data as MessageRow[];
  },

  async create(message: Database['public']['Tables']['messages']['Insert']) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    if (error) throw error;
    return data as MessageRow;
  },

  async markAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId);
    if (error) throw error;
  },

  subscribeToConversation(conversationId: string, callback: (message: MessageRow) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new as MessageRow);
        }
      )
      .subscribe();
  },
};

// Saved Workers Operations
export const savedWorkerService = {
  async getByEmployerId(employerId: string) {
    const { data, error } = await supabase
      .from('saved_workers')
      .select(`
        *,
        worker:worker_profiles(*)
      `)
      .eq('employer_id', employerId);
    if (error) throw error;
    return data;
  },

  async save(employerId: string, workerId: string) {
    const { data, error } = await supabase
      .from('saved_workers')
      .insert({ employer_id: employerId, worker_id: workerId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async unsave(employerId: string, workerId: string) {
    const { error } = await supabase
      .from('saved_workers')
      .delete()
      .eq('employer_id', employerId)
      .eq('worker_id', workerId);
    if (error) throw error;
  },

  async isSaved(employerId: string, workerId: string) {
    const { data, error } = await supabase
      .from('saved_workers')
      .select('id')
      .eq('employer_id', employerId)
      .eq('worker_id', workerId)
      .single();
    return !!data;
  },
};

// User Profile Operations
export const userProfileService = {
  async create(profile: Database['public']['Tables']['user_profiles']['Insert']) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};
