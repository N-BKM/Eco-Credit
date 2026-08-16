import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Profile } from '../types';
import { dbService, supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, role: 'student' | 'admin') => Promise<boolean>;
  signup: (data: { full_name: string; student_id: string; year_of_study: string; department: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUserBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await dbService.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const p = await dbService.getProfile();
          setUser(p);
        } else {
          setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (identifier: string, password: string, role: 'student' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const profile = await dbService.authenticateByIdAndPassword(identifier, password, role);
      if (profile) {
        setUser(profile);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { full_name: string; student_id: string; year_of_study: string; department: string; password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newProfile = await dbService.registerStudent(data);
      setUser(newProfile);
      return true;
    } catch (err: any) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('ecocredit_active_session');
    localStorage.removeItem('ecocredit_user_profile');
    setUser(null);
  };

  const refreshProfile = async () => {
    const p = await dbService.getProfile();
    setUser(p);
  };

  const updateUserBalance = (newBalance: number) => {
    if (user) {
      const updated = { ...user, eco_credits: newBalance };
      setUser(updated);
      dbService.updateProfile({ eco_credits: newBalance });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        signup,
        logout,
        refreshProfile,
        updateUserBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
