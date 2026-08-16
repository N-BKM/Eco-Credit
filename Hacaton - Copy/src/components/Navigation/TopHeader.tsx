import React from 'react';
import { Leaf, Award, ShieldCheck, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopHeaderProps {
  onTabChange: (tab: string) => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onTabChange, isAdminView, setIsAdminView }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0F3A2D]/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onTabChange('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#09291F] border border-[#D4AF37] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide leading-tight group-hover:text-[#D4AF37] transition-colors">
              Smart EcoCredit System
            </h1>
            <p className="text-[11px] text-[#E6C65C]/80 tracking-wider">
              Green Campus Disposal & Rewards
            </p>
          </div>
        </div>

        {/* User Balance & Admin Mode Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* EcoCredits Quick Badge */}
          {user && (
            <button
              onClick={() => onTabChange('wallet')}
              className="bg-[#09291F] border border-[#D4AF37]/50 hover:border-[#D4AF37] px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-sm transition-all"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-bold text-[#D4AF37]">
                {user.eco_credits || 0}
              </span>
              <span className="text-[11px] text-[#E8E8E8] hidden sm:inline">CR</span>
            </button>
          )}

          {/* Admin Switcher */}
          <button
            onClick={() => {
              const nextState = !isAdminView;
              setIsAdminView(nextState);
              if (nextState) onTabChange('admin');
              else onTabChange('home');
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isAdminView 
                ? 'bg-[#D4AF37] text-[#09291F] border-[#D4AF37]' 
                : 'bg-[#09291F] text-[#E6C65C] border-[#D4AF37]/40 hover:border-[#D4AF37]'
            }`}
            title="Toggle Admin Analytics View"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">{isAdminView ? 'Admin View Active' : 'Admin Portal'}</span>
          </button>

          {/* Landing / Pitch View Link */}
          <button
            onClick={() => onTabChange('landing')}
            className="text-white/70 hover:text-[#D4AF37] p-1.5 rounded-lg transition-colors hidden md:block"
            title="View Pitch / Landing Page"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Logout button */}
          {user && (
            <button
              onClick={logout}
              className="text-white/60 hover:text-red-400 p-1.5 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
