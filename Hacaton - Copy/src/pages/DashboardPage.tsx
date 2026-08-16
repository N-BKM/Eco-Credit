import React, { useState, useEffect } from 'react';
import { 
  Award, QrCode, Trophy, Wallet, CheckCircle2, 
  Clock, MapPin, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../lib/supabase';
import type { WalletTransaction, WasteDisposal } from '../types';
import { DAILY_REWARDED_CAP } from '../constants/ecoConfig';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [recentTx, setRecentTx] = useState<WalletTransaction[]>([]);
  const [todayRewardedCount, setTodayRewardedCount] = useState<number>(0);
  const [disposals, setDisposals] = useState<WasteDisposal[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const txs = await dbService.getTransactions();
        setRecentTx(txs.slice(0, 4));

        const { todayRewardedCount: count, all } = await dbService.getDisposals();
        setTodayRewardedCount(count);
        setDisposals(all.slice(0, 3));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. HERO BALANCE CARD */}
      <div className="relative bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Decorative Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-bold text-[#E6C65C] tracking-widest uppercase bg-[#09291F] border border-[#D4AF37]/40 px-3 py-1 rounded-full">
                {user?.department || 'Computer Science & Engineering'}
              </span>
              <span className="text-xs text-[#E8E8E8]/70">
                {user?.year_of_study || '3rd Year'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Welcome back, <span className="text-[#D4AF37]">{user?.full_name?.split(' ')[0] || 'Student'}</span>!
            </h1>
            <p className="text-sm text-[#E8E8E8]/80 mt-1">
              Student ID: <strong className="text-white">{user?.student_id || 'CS2026-8942'}</strong>
            </p>
          </div>

          {/* EcoCredit Balance Widget */}
          <div className="bg-[#09291F] border border-[#D4AF37]/60 rounded-2xl p-5 shadow-inner min-w-[240px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#E8E8E8]/70 tracking-wider">ECOCREDIT BALANCE</span>
              <Award className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-bold text-[#D4AF37] tracking-tight">
                {user?.eco_credits || 0}
              </span>
              <span className="text-sm font-bold text-[#E6C65C]">EcoCredits</span>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
              <span className="text-white/70">Level: <strong className="text-[#D4AF37]">Gold Recycler</strong></span>
              <button 
                onClick={() => onNavigate('wallet')}
                className="text-[#D4AF37] hover:underline font-bold flex items-center space-x-1"
              >
                <span>Wallet</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 2. DAILY REWARDED DISPOSAL CAP TRACKER */}
      <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#09291F] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Daily EcoCredit Disposal Limit</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Max 3 / Day
              </span>
            </h3>
            <p className="text-xs text-[#E8E8E8]/80 mt-0.5">
              {todayRewardedCount >= DAILY_REWARDED_CAP
                ? 'Daily EcoCredit limit reached (3/3). Additional disposals will be recorded with 0 credits.'
                : `You have completed ${todayRewardedCount} of ${DAILY_REWARDED_CAP} rewarded disposals today.`}
            </p>
          </div>
        </div>

        {/* Progress Bar & CTA */}
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="flex-1 bg-[#09291F] h-3 rounded-full overflow-hidden border border-[#D4AF37]/30">
            <div 
              className="bg-gradient-to-r from-[#E6C65C] to-[#D4AF37] h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (todayRewardedCount / DAILY_REWARDED_CAP) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#D4AF37]">
            {todayRewardedCount}/{DAILY_REWARDED_CAP}
          </span>
        </div>
      </div>

      {/* 3. QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <button
          onClick={() => onNavigate('scanner')}
          className="group bg-[#0F3A2D] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-5 text-left transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl bg-[#09291F] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
            Scan & Dispose Waste
          </h3>
          <p className="text-xs text-[#E8E8E8]/70">
            Identify waste category with AI vision and locate nearest bin.
          </p>
        </button>

        <button
          onClick={() => onNavigate('wallet')}
          className="group bg-[#0F3A2D] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-5 text-left transition-all hover:-translate-y-1 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-[#09291F] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
            Redeem Rewards
          </h3>
          <p className="text-xs text-[#E8E8E8]/70">
            Exchange EcoCredits for canteen vouchers, prints & merch.
          </p>
        </button>

        <button
          onClick={() => onNavigate('leaderboard')}
          className="group bg-[#0F3A2D] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-5 text-left transition-all hover:-translate-y-1 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-[#09291F] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
            Campus Leaderboard
          </h3>
          <p className="text-xs text-[#E8E8E8]/70">
            See your rank among top recycling students and departments.
          </p>
        </button>

      </div>

      {/* 4. RECENT ACTIVITY & DISPOSALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Transactions */}
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span>Recent Wallet Activity</span>
            </h3>
            <button 
              onClick={() => onNavigate('wallet')}
              className="text-xs font-bold text-[#D4AF37] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTx.length === 0 ? (
              <p className="text-xs text-[#E8E8E8]/60 text-center py-6">No recent transactions recorded.</p>
            ) : (
              recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3.5 bg-[#09291F] border border-[#D4AF37]/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      tx.type === 'credited' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                    }`}>
                      {tx.type === 'credited' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">{tx.description}</p>
                      <p className="text-[10px] text-[#E8E8E8]/60">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === 'credited' ? 'text-[#D4AF37]' : 'text-amber-400'}`}>
                    {tx.type === 'credited' ? `+${tx.amount}` : `-${tx.amount}`} CR
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Verified Campus Disposals */}
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              <span>Verified Disposals</span>
            </h3>
            <button 
              onClick={() => onNavigate('scanner')}
              className="text-xs font-bold text-[#D4AF37] hover:underline"
            >
              New Scan
            </button>
          </div>

          <div className="space-y-3">
            {disposals.length === 0 ? (
              <p className="text-xs text-[#E8E8E8]/60 text-center py-6">No waste disposals recorded yet.</p>
            ) : (
              disposals.map((disp) => (
                <div key={disp.id} className="p-3.5 bg-[#09291F] border border-[#D4AF37]/20 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#E6C65C]">{disp.waste_category}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                        {disp.ai_confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-[#E8E8E8]/70 mt-1 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span>Bin {disp.bin_label || 'RB-01'} ({disp.bin_location || 'Campus Quad'})</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#D4AF37]">+{disp.credits_awarded} CR</span>
                    <span className="text-[10px] text-emerald-400 block font-bold">VERIFIED</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
