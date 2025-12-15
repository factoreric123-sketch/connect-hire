import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType, WorkerProfile, EmployerProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { 
  workerService, 
  employerService, 
  savedWorkerService, 
  userProfileService 
} from '@/lib/database';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  workerProfile: WorkerProfile | null;
  employerProfile: EmployerProfile | null;
  savedWorkerIds: string[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userType: UserType, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateWorkerProfile: (profile: Partial<WorkerProfile>) => Promise<void>;
  updateEmployerProfile: (profile: Partial<EmployerProfile>) => Promise<void>;
  saveWorker: (workerId: string) => Promise<void>;
  unsaveWorker: (workerId: string) => Promise<void>;
  isWorkerSaved: (workerId: string) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [savedWorkerIds, setSavedWorkerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setWorkerProfile(null);
        setEmployerProfile(null);
        setSavedWorkerIds([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Get user profile
      const userProfile = await userProfileService.getById(userId);
      
      setUser({
        id: userProfile.id,
        email: userProfile.email,
        userType: userProfile.user_type,
        createdAt: userProfile.created_at,
      });

      // Load type-specific profile
      if (userProfile.user_type === 'worker') {
        const profile = await workerService.getByUserId(userId);
        setWorkerProfile({
          id: profile.id,
          userId: profile.user_id,
          name: profile.name,
          avatar: profile.avatar_url || undefined,
          country: profile.country,
          countryCode: profile.country_code,
          headline: profile.headline,
          skills: profile.skills,
          hourlyRateMin: Number(profile.hourly_rate_min),
          hourlyRateMax: Number(profile.hourly_rate_max),
          availabilityHours: profile.availability_hours,
          availabilityType: profile.availability_type,
          bio: profile.bio,
          lastActive: profile.last_active,
          isVerified: profile.is_verified,
          reviewCount: profile.review_count,
          averageRating: Number(profile.average_rating),
        });
      } else {
        const profile = await employerService.getByUserId(userId);
        setEmployerProfile({
          id: profile.id,
          userId: profile.user_id,
          companyName: profile.company_name,
          avatar: profile.avatar_url || undefined,
          country: profile.country,
          countryCode: profile.country_code,
          bio: profile.bio,
          createdAt: profile.created_at,
        });

        // Load saved workers for employer
        const saved = await savedWorkerService.getByEmployerId(profile.id);
        setSavedWorkerIds(saved.map((s: any) => s.worker_id));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    userType: UserType,
    name: string
  ): Promise<boolean> => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        toast.error(authError.message);
        return false;
      }

      if (!authData.user) {
        toast.error('Failed to create account');
        return false;
      }

      // Create user profile
      await userProfileService.create({
        id: authData.user.id,
        email,
        user_type: userType,
      });

      // Create type-specific profile
      if (userType === 'worker') {
        await workerService.create({
          user_id: authData.user.id,
          name,
          country: '',
          country_code: '',
          headline: '',
          skills: [],
          hourly_rate_min: 1,
          hourly_rate_max: 3,
          availability_hours: 8,
          availability_type: 'full-time',
          bio: '',
        });
      } else {
        await employerService.create({
          user_id: authData.user.id,
          company_name: name,
          country: '',
          country_code: '',
          bio: '',
        });
      }

      toast.success('Account created! Please check your email to verify your account.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        setUser(null);
        setWorkerProfile(null);
        setEmployerProfile(null);
        setSavedWorkerIds([]);
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  const updateWorkerProfile = async (profile: Partial<WorkerProfile>) => {
    if (!workerProfile || !user) return;

    try {
      const updated = await workerService.updateByUserId(user.id, {
        name: profile.name,
        avatar_url: profile.avatar,
        country: profile.country,
        country_code: profile.countryCode,
        headline: profile.headline,
        skills: profile.skills,
        hourly_rate_min: profile.hourlyRateMin,
        hourly_rate_max: profile.hourlyRateMax,
        availability_hours: profile.availabilityHours,
        availability_type: profile.availabilityType,
        bio: profile.bio,
      });

      setWorkerProfile({
        id: updated.id,
        userId: updated.user_id,
        name: updated.name,
        avatar: updated.avatar_url || undefined,
        country: updated.country,
        countryCode: updated.country_code,
        headline: updated.headline,
        skills: updated.skills,
        hourlyRateMin: Number(updated.hourly_rate_min),
        hourlyRateMax: Number(updated.hourly_rate_max),
        availabilityHours: updated.availability_hours,
        availabilityType: updated.availability_type,
        bio: updated.bio,
        lastActive: updated.last_active,
        isVerified: updated.is_verified,
        reviewCount: updated.review_count,
        averageRating: Number(updated.average_rating),
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating worker profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const updateEmployerProfile = async (profile: Partial<EmployerProfile>) => {
    if (!employerProfile || !user) return;

    try {
      const updated = await employerService.updateByUserId(user.id, {
        company_name: profile.companyName,
        avatar_url: profile.avatar,
        country: profile.country,
        country_code: profile.countryCode,
        bio: profile.bio,
      });

      setEmployerProfile({
        id: updated.id,
        userId: updated.user_id,
        companyName: updated.company_name,
        avatar: updated.avatar_url || undefined,
        country: updated.country,
        countryCode: updated.country_code,
        bio: updated.bio,
        createdAt: updated.created_at,
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating employer profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const saveWorker = async (workerId: string) => {
    if (!employerProfile) {
      toast.error('You must be logged in as an employer');
      return;
    }

    try {
      await savedWorkerService.save(employerProfile.id, workerId);
      setSavedWorkerIds([...savedWorkerIds, workerId]);
      toast.success('Worker saved!');
    } catch (error) {
      console.error('Error saving worker:', error);
      toast.error('Failed to save worker');
    }
  };

  const unsaveWorker = async (workerId: string) => {
    if (!employerProfile) return;

    try {
      await savedWorkerService.unsave(employerProfile.id, workerId);
      setSavedWorkerIds(savedWorkerIds.filter((id) => id !== workerId));
      toast.success('Worker removed from saved');
    } catch (error) {
      console.error('Error unsaving worker:', error);
      toast.error('Failed to unsave worker');
    }
  };

  const isWorkerSaved = (workerId: string): boolean => {
    return savedWorkerIds.includes(workerId);
  };

  const refreshProfile = async () => {
    if (supabaseUser) {
      await loadUserProfile(supabaseUser.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        workerProfile,
        employerProfile,
        savedWorkerIds,
        isLoading,
        login,
        signup,
        logout,
        updateWorkerProfile,
        updateEmployerProfile,
        saveWorker,
        unsaveWorker,
        isWorkerSaved,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
