import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Profile, Bin, WasteDisposal, WalletTransaction, Reward, RewardRedemption } from '../types';
import { 
  INITIAL_USER_PROFILE, 
  MOCK_ADMIN_PROFILE,
  MOCK_BINS, 
  MOCK_REWARDS, 
  MOCK_RECENT_TRANSACTIONS, 
  MOCK_DISPOSALS
} from '../constants/mockData';
import { DAILY_REWARDED_CAP, WASTE_CREDIT_VALUES } from '../constants/ecoConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local Storage Keys
const STORAGE_KEYS = {
  PROFILE: 'ecocredit_user_profile',
  PROFILES_LIST: 'ecocredit_all_profiles',
  TRANSACTIONS: 'ecocredit_transactions',
  DISPOSALS: 'ecocredit_disposals',
  REDEMPTIONS: 'ecocredit_redemptions',
};

// Initialize LocalStorage state
const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES_LIST)) {
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify([INITIAL_USER_PROFILE, MOCK_ADMIN_PROFILE]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(MOCK_RECENT_TRANSACTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISPOSALS)) {
    localStorage.setItem(STORAGE_KEYS.DISPOSALS, JSON.stringify(MOCK_DISPOSALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REDEMPTIONS)) {
    localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify([]));
  }
};

initLocalStorage();

// Data access & auth abstraction
export const dbService = {
  async getProfile(): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data && !error) return data;
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const activeSession = localStorage.getItem('ecocredit_active_session');
    if (activeSession && raw) {
      return JSON.parse(raw);
    }
    return null;
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
        if (data) return data;
      }
    }
    const current = (await this.getProfile()) || INITIAL_USER_PROFILE;
    const updated: Profile = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

    // Also update in profiles list
    const allProfiles: Profile[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES_LIST) || '[]');
    const idx = allProfiles.findIndex(p => p.student_id === updated.student_id || p.id === updated.id);
    if (idx >= 0) allProfiles[idx] = updated;
    else allProfiles.push(updated);
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify(allProfiles));

    return updated;
  },

  async getAllProfiles(): Promise<Profile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('profiles').select('*');
      if (data && data.length > 0) return data;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES_LIST);
    return raw ? JSON.parse(raw) : [INITIAL_USER_PROFILE, MOCK_ADMIN_PROFILE];
  },

  async checkStudentIdExists(studentId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('profiles').select('student_id').eq('student_id', studentId.trim().toUpperCase());
      return Boolean(data && data.length > 0);
    }
    const allProfiles = await this.getAllProfiles();
    return allProfiles.some(p => p.student_id.toUpperCase() === studentId.trim().toUpperCase());
  },

  async authenticateByIdAndPassword(identifier: string, password: string, expectedRole: 'student' | 'admin'): Promise<Profile | null> {
    const cleanId = identifier.trim().toUpperCase();

    // Check default seeded admin
    if (expectedRole === 'admin') {
      if (cleanId === 'ADMIN-2026-001' && password === 'admin@ecocredit2026') {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(MOCK_ADMIN_PROFILE));
        localStorage.setItem('ecocredit_active_session', 'true');
        return MOCK_ADMIN_PROFILE;
      }
      // Check database or storage for admin role
      const profiles = await this.getAllProfiles();
      const adminMatch = profiles.find(p => p.student_id.toUpperCase() === cleanId && p.role === 'admin');
      if (adminMatch) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(adminMatch));
        localStorage.setItem('ecocredit_active_session', 'true');
        return adminMatch;
      }
      return null;
    }

    // Student Authentication
    if (isSupabaseConfigured && supabase) {
      const syntheticEmail = `${cleanId.toLowerCase()}@campus.ecocredit.edu`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password: password,
      });
      if (!error && data.user) {
        localStorage.setItem('ecocredit_active_session', 'true');
        const profile = await this.getProfile();
        return profile;
      }
    }

    // Local Storage Fallback Student Auth
    const profiles = await this.getAllProfiles();
    const studentMatch = profiles.find(p => p.student_id.toUpperCase() === cleanId && p.role !== 'admin');
    if (studentMatch) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(studentMatch));
      localStorage.setItem('ecocredit_active_session', 'true');
      return studentMatch;
    }

    // Allow default student demo login if CS2026-8942
    if (cleanId === 'CS2026-8942') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      localStorage.setItem('ecocredit_active_session', 'true');
      return INITIAL_USER_PROFILE;
    }

    return null;
  },

  async registerStudent(data: { full_name: string; student_id: string; year_of_study: string; department: string; password: string }): Promise<Profile> {
    const cleanId = data.student_id.trim().toUpperCase();
    const syntheticEmail = `${cleanId.toLowerCase()}@campus.ecocredit.edu`;

    const exists = await this.checkStudentIdExists(cleanId);
    if (exists) {
      throw new Error(`Student ID ${cleanId} is already registered.`);
    }

    let newProfile: Profile = {
      id: 'usr-' + Date.now(),
      full_name: data.full_name,
      student_id: cleanId,
      department: data.department,
      year_of_study: data.year_of_study,
      role: 'student',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      created_at: new Date().toISOString(),
      eco_credits: 20 // Welcome signup bonus
    };

    if (isSupabaseConfigured && supabase) {
      const { data: authData, error } = await supabase.auth.signUp({
        email: syntheticEmail,
        password: data.password,
      });
      if (!error && authData.user) {
        newProfile.id = authData.user.id;
        await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: data.full_name,
          student_id: cleanId,
          department: data.department,
          year_of_study: data.year_of_study,
          role: 'student',
          avatar_url: newProfile.avatar_url,
        });
      }
    }

    // Add welcome bonus transaction record for new student
    const welcomeTx: WalletTransaction = {
      id: 'tx-welcome-' + Date.now(),
      student_id: newProfile.id,
      type: 'credited',
      amount: 20,
      description: 'Welcome Account Registration EcoCredit Bonus',
      status: 'completed',
      created_at: new Date().toISOString()
    };

    const existingTxs: WalletTransaction[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([welcomeTx, ...existingTxs]));

    // Save to LocalStorage
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    localStorage.setItem('ecocredit_active_session', 'true');
    const allProfiles = await this.getAllProfiles();
    localStorage.setItem(STORAGE_KEYS.PROFILES_LIST, JSON.stringify([newProfile, ...allProfiles]));

    // Emit live event for instant dashboard refetching
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('student_registered', { detail: newProfile }));
    }

    return newProfile;
  },

  async getBins(): Promise<Bin[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('bins').select('*');
      if (data && !error && data.length > 0) return data;
    }
    return MOCK_BINS;
  },

  async getRewards(): Promise<Reward[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('rewards').select('*');
      if (data && !error && data.length > 0) return data;
    }
    return MOCK_REWARDS;
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    const profile = await this.getProfile();
    if (!profile) return [];

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('wallet_transactions').select('*').eq('student_id', user.id).order('created_at', { ascending: false });
        if (data) return data;
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const allTx: WalletTransaction[] = raw ? JSON.parse(raw) : [];
    // User-scoped transactions filter: return only current user credit details
    return allTx.filter(tx => tx.student_id === profile.id || tx.student_id === profile.student_id);
  },

  async getDisposals(): Promise<WasteDisposalsCount> {
    const profile = await this.getProfile();
    let disposals: WasteDisposal[] = [];

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('waste_disposals').select('*').eq('student_id', user.id).order('created_at', { ascending: false });
        if (data) disposals = data;
      }
    } else {
      const raw = localStorage.getItem(STORAGE_KEYS.DISPOSALS);
      const allDisposals: WasteDisposal[] = raw ? JSON.parse(raw) : [];
      // User-scoped disposals filter
      if (profile) {
        disposals = allDisposals.filter(d => d.student_id === profile.id || d.student_id === profile.student_id);
      } else {
        disposals = [];
      }
    }

    // 24-hour rolling limit calculation: disposals older than 24 hours expire from count
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentRewardedDisposals = disposals.filter(d => {
      const disposalTime = new Date(d.created_at).getTime();
      return d.credits_awarded > 0 && disposalTime > twentyFourHoursAgo;
    });

    return {
      all: disposals,
      todayRewardedCount: recentRewardedDisposals.length
    };
  },

  async recordDisposalAndAwardCredits(binId: string, category: string, confidence: number, imageName?: string): Promise<{ disposal: WasteDisposal; transaction?: WalletTransaction; awardedCredits: number; capReached: boolean }> {
    const profile = (await this.getProfile()) || INITIAL_USER_PROFILE;
    const bins = await this.getBins();
    const bin = bins.find(b => b.id === binId || b.qr_code === binId) || bins[0];
    const { todayRewardedCount, all: currentDisposals } = await this.getDisposals();

    const baseCredits = (WASTE_CREDIT_VALUES[category] || WASTE_CREDIT_VALUES['Recyclable']).credits;
    const capReached = todayRewardedCount >= DAILY_REWARDED_CAP;
    const awardedCredits = capReached ? 0 : baseCredits;

    const newDisposal: WasteDisposal = {
      id: 'disp-' + Date.now(),
      student_id: profile.id,
      bin_id: bin.id,
      waste_category: category as any,
      ai_confidence: confidence,
      image_url: imageName,
      credits_awarded: awardedCredits,
      status: 'verified',
      created_at: new Date().toISOString(),
      verified_at: new Date().toISOString(),
      bin_label: bin.label,
      bin_location: bin.location_name
    };

    let newTransaction: WalletTransaction | undefined = undefined;

    if (awardedCredits > 0) {
      newTransaction = {
        id: 'tx-' + Date.now(),
        student_id: profile.id,
        type: 'credited',
        amount: awardedCredits,
        description: `Verified disposal of ${category} at Bin ${bin.label} (${bin.location_name})`,
        related_disposal_id: newDisposal.id,
        status: 'completed',
        created_at: new Date().toISOString()
      };
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('waste_disposals').insert({
        student_id: profile.id,
        bin_id: bin.id,
        waste_category: category,
        ai_confidence: confidence,
        credits_awarded: awardedCredits,
        status: 'verified',
        verified_at: new Date().toISOString()
      });

      if (newTransaction) {
        await supabase.from('wallet_transactions').insert({
          student_id: profile.id,
          type: 'credited',
          amount: awardedCredits,
          description: newTransaction.description,
          status: 'completed'
        });
      }
    } else {
      const updatedDisposals = [newDisposal, ...currentDisposals];
      localStorage.setItem(STORAGE_KEYS.DISPOSALS, JSON.stringify(updatedDisposals));

      if (newTransaction) {
        const txs = await this.getTransactions();
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([newTransaction, ...txs]));

        const newBalance = (profile.eco_credits || 0) + awardedCredits;
        await this.updateProfile({ eco_credits: newBalance });
      }
    }

    return {
      disposal: newDisposal,
      transaction: newTransaction,
      awardedCredits,
      capReached
    };
  },

  async redeemReward(rewardId: string): Promise<{ redemption: RewardRedemption; transaction: WalletTransaction; newBalance: number }> {
    const profile = (await this.getProfile()) || INITIAL_USER_PROFILE;
    const rewards = await this.getRewards();
    const reward = rewards.find(r => r.id === rewardId);

    if (!reward) throw new Error('Reward not found');
    if ((profile.eco_credits || 0) < reward.cost_credits) {
      throw new Error(`Insufficient EcoCredits. Required: ${reward.cost_credits}, Available: ${profile.eco_credits}`);
    }

    const redemptionCode = 'ECO-RED-' + Math.floor(100000 + Math.random() * 900000);
    const newBalance = (profile.eco_credits || 0) - reward.cost_credits;

    const newRedemption: RewardRedemption = {
      id: 'red-' + Date.now(),
      student_id: profile.id,
      reward_id: reward.id,
      redemption_code: redemptionCode,
      status: 'pending',
      created_at: new Date().toISOString(),
      reward
    };

    const newTx: WalletTransaction = {
      id: 'tx-red-' + Date.now(),
      student_id: profile.id,
      type: 'redeemed',
      amount: reward.cost_credits,
      description: `Redeemed ${reward.name}`,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('reward_redemptions').insert({
        student_id: profile.id,
        reward_id: reward.id,
        redemption_code: redemptionCode,
        status: 'pending'
      });

      await supabase.from('wallet_transactions').insert({
        student_id: profile.id,
        type: 'redeemed',
        amount: reward.cost_credits,
        description: newTx.description,
        status: 'completed'
      });
    } else {
      const redemptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.REDEMPTIONS) || '[]');
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify([newRedemption, ...redemptions]));

      const txs = await this.getTransactions();
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([newTx, ...txs]));

      await this.updateProfile({ eco_credits: newBalance });
    }

    return {
      redemption: newRedemption,
      transaction: newTx,
      newBalance
    };
  }
};

interface WasteDisposalsCount {
  all: WasteDisposal[];
  todayRewardedCount: number;
}
