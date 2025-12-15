export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          user_type: 'worker' | 'employer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          user_type: 'worker' | 'employer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          user_type?: 'worker' | 'employer'
          created_at?: string
          updated_at?: string
        }
      }
      worker_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          avatar_url: string | null
          country: string
          country_code: string
          headline: string
          skills: string[]
          hourly_rate_min: number
          hourly_rate_max: number
          availability_hours: number
          availability_type: 'part-time' | 'full-time'
          bio: string
          last_active: string
          is_verified: boolean
          review_count: number
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          avatar_url?: string | null
          country: string
          country_code: string
          headline?: string
          skills?: string[]
          hourly_rate_min?: number
          hourly_rate_max?: number
          availability_hours?: number
          availability_type?: 'part-time' | 'full-time'
          bio?: string
          last_active?: string
          is_verified?: boolean
          review_count?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          avatar_url?: string | null
          country?: string
          country_code?: string
          headline?: string
          skills?: string[]
          hourly_rate_min?: number
          hourly_rate_max?: number
          availability_hours?: number
          availability_type?: 'part-time' | 'full-time'
          bio?: string
          last_active?: string
          is_verified?: boolean
          review_count?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      employer_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          avatar_url: string | null
          country: string
          country_code: string
          bio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          avatar_url?: string | null
          country?: string
          country_code?: string
          bio?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          avatar_url?: string | null
          country?: string
          country_code?: string
          bio?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          employer_id: string
          title: string
          description: string
          skills: string[]
          hourly_rate_min: number
          hourly_rate_max: number
          availability_hours: number
          country_preference: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          title: string
          description: string
          skills?: string[]
          hourly_rate_min?: number
          hourly_rate_max?: number
          availability_hours?: number
          country_preference?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          title?: string
          description?: string
          skills?: string[]
          hourly_rate_min?: number
          hourly_rate_max?: number
          availability_hours?: number
          country_preference?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          worker_id: string
          employer_id: string
          rating: number
          comment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          employer_id: string
          rating: number
          comment: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          employer_id?: string
          rating?: number
          comment?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          worker_id: string
          employer_id: string
          last_message: string | null
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          employer_id: string
          last_message?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          employer_id?: string
          last_message?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      saved_workers: {
        Row: {
          id: string
          employer_id: string
          worker_id: string
          created_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          worker_id: string
          created_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          worker_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
