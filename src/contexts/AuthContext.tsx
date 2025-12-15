import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType, WorkerProfile, EmployerProfile, SavedWorker } from '@/types';

interface AuthContextType {
  user: User | null;
  workerProfile: WorkerProfile | null;
  employerProfile: EmployerProfile | null;
  savedWorkers: SavedWorker[];
  isLoading: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<boolean>;
  signup: (email: string, password: string, userType: UserType, name: string) => Promise<boolean>;
  logout: () => void;
  updateWorkerProfile: (profile: Partial<WorkerProfile>) => void;
  updateEmployerProfile: (profile: Partial<EmployerProfile>) => void;
  saveWorker: (workerId: string) => void;
  unsaveWorker: (workerId: string) => void;
  isWorkerSaved: (workerId: string) => boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [savedWorkers, setSavedWorkers] = useState<SavedWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('cw_user');
    const storedWorkerProfile = localStorage.getItem('cw_worker_profile');
    const storedEmployerProfile = localStorage.getItem('cw_employer_profile');
    const storedSavedWorkers = localStorage.getItem('cw_saved_workers');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedWorkerProfile) {
      setWorkerProfile(JSON.parse(storedWorkerProfile));
    }
    if (storedEmployerProfile) {
      setEmployerProfile(JSON.parse(storedEmployerProfile));
    }
    if (storedSavedWorkers) {
      setSavedWorkers(JSON.parse(storedSavedWorkers));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      userType,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('cw_user', JSON.stringify(newUser));
    
    return true;
  };

  const signup = async (email: string, password: string, userType: UserType, name: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      userType,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('cw_user', JSON.stringify(newUser));

    if (userType === 'worker') {
      const newProfile: WorkerProfile = {
        id: `wp_${Date.now()}`,
        userId: newUser.id,
        name,
        country: '',
        countryCode: '',
        headline: '',
        skills: [],
        hourlyRateMin: 1,
        hourlyRateMax: 3,
        availabilityHours: 8,
        availabilityType: 'full-time',
        bio: '',
        lastActive: new Date().toISOString(),
        isVerified: false,
        reviewCount: 0,
        averageRating: 0,
      };
      setWorkerProfile(newProfile);
      localStorage.setItem('cw_worker_profile', JSON.stringify(newProfile));
    } else {
      const newProfile: EmployerProfile = {
        id: `ep_${Date.now()}`,
        userId: newUser.id,
        companyName: name,
        country: '',
        countryCode: '',
        bio: '',
        createdAt: new Date().toISOString(),
      };
      setEmployerProfile(newProfile);
      localStorage.setItem('cw_employer_profile', JSON.stringify(newProfile));
    }
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setWorkerProfile(null);
    setEmployerProfile(null);
    localStorage.removeItem('cw_user');
    localStorage.removeItem('cw_worker_profile');
    localStorage.removeItem('cw_employer_profile');
  };

  const updateWorkerProfile = (profile: Partial<WorkerProfile>) => {
    if (workerProfile) {
      const updated = { ...workerProfile, ...profile };
      setWorkerProfile(updated);
      localStorage.setItem('cw_worker_profile', JSON.stringify(updated));
    }
  };

  const updateEmployerProfile = (profile: Partial<EmployerProfile>) => {
    if (employerProfile) {
      const updated = { ...employerProfile, ...profile };
      setEmployerProfile(updated);
      localStorage.setItem('cw_employer_profile', JSON.stringify(updated));
    }
  };

  const saveWorker = (workerId: string) => {
    if (!user) return;
    const newSaved: SavedWorker = {
      id: `sw_${Date.now()}`,
      employerId: user.id,
      workerId,
      savedAt: new Date().toISOString(),
    };
    const updated = [...savedWorkers, newSaved];
    setSavedWorkers(updated);
    localStorage.setItem('cw_saved_workers', JSON.stringify(updated));
  };

  const unsaveWorker = (workerId: string) => {
    const updated = savedWorkers.filter(sw => sw.workerId !== workerId);
    setSavedWorkers(updated);
    localStorage.setItem('cw_saved_workers', JSON.stringify(updated));
  };

  const isWorkerSaved = (workerId: string): boolean => {
    return savedWorkers.some(sw => sw.workerId === workerId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        employerProfile,
        savedWorkers,
        isLoading,
        login,
        signup,
        logout,
        updateWorkerProfile,
        updateEmployerProfile,
        saveWorker,
        unsaveWorker,
        isWorkerSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
