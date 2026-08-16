import React from 'react';
import { Home, Trophy, QrCode, Wallet, User, ShieldCheck } from 'lucide-react';

interface CradledBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export const CradledBottomNav: React.FC<CradledBottomNavProps> = ({ currentTab, onTabChange, isAdmin }) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 max-w-xl mx-auto pointer-events-none">
      <div className="relative bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-full px-6 py-2 shadow-2xl flex items-center justify-between pointer-events-auto backdrop-blur-md">
        
        {/* Left Nav Group: Home & Leaderboard */}
        <div className="flex items-center space-x-6 sm:space-x-10">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center transition-all duration-200 group ${
              currentTab === 'home' ? 'text-[#D4AF37]' : 'text-white/80 hover:text-white'
            }`}
            title="Home Dashboard"
          >
            <div className={`p-1.5 rounded-full transition-transform group-hover:scale-110 ${
              currentTab === 'home' ? 'bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40' : ''
            }`}>
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold mt-0.5 tracking-wider">HOME</span>
          </button>

          <button
            onClick={() => onTabChange('leaderboard')}
            className={`flex flex-col items-center justify-center transition-all duration-200 group ${
              currentTab === 'leaderboard' ? 'text-[#D4AF37]' : 'text-white/80 hover:text-white'
            }`}
            title="Campus Leaderboard"
          >
            <div className={`p-1.5 rounded-full transition-transform group-hover:scale-110 ${
              currentTab === 'leaderboard' ? 'bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40' : ''
            }`}>
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold mt-0.5 tracking-wider">LEADERBOARD</span>
          </button>
        </div>

        {/* Center Scanner Button (Cradled, Floating Gold Gradient) */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 flex flex-col items-center">
          <button
            onClick={() => onTabChange('scanner')}
            aria-label="Open Scanner"
            className="group relative w-15 h-15 sm:w-16 sm:h-16 rounded-full eco-gold-gradient p-0.5 shadow-lg shadow-[#D4AF37]/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer ring-4 ring-[#09291F]"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#E6C65C] via-[#D4AF37] to-[#B38F10] flex flex-col items-center justify-center text-[#09291F] font-bold shadow-inner">
              <QrCode className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-[#09291F] transition-transform group-hover:rotate-6" />
            </div>
            {/* Outer subtle gold glow pulse */}
            <div className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
          </button>
          <span className="text-[10px] font-bold text-[#D4AF37] mt-1 tracking-widest uppercase shadow-sm">SCANNER</span>
        </div>

        {/* Right Nav Group: Wallet & Profile */}
        <div className="flex items-center space-x-6 sm:space-x-10">
          <button
            onClick={() => onTabChange('wallet')}
            className={`flex flex-col items-center justify-center transition-all duration-200 group ${
              currentTab === 'wallet' ? 'text-[#D4AF37]' : 'text-white/80 hover:text-white'
            }`}
            title="EcoCredit Wallet"
          >
            <div className={`p-1.5 rounded-full transition-transform group-hover:scale-110 ${
              currentTab === 'wallet' ? 'bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40' : ''
            }`}>
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold mt-0.5 tracking-wider">WALLET</span>
          </button>

          <button
            onClick={() => onTabChange(isAdmin ? 'admin' : 'profile')}
            className={`flex flex-col items-center justify-center transition-all duration-200 group ${
              currentTab === 'profile' || currentTab === 'admin' ? 'text-[#D4AF37]' : 'text-white/80 hover:text-white'
            }`}
            title={isAdmin ? "Admin Portal" : "Student Profile"}
          >
            <div className={`p-1.5 rounded-full transition-transform group-hover:scale-110 ${
              currentTab === 'profile' || currentTab === 'admin' ? 'bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40' : ''
            }`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" /> : <User className="w-5 h-5 sm:w-6 sm:h-6" />}
            </div>
            <span className="text-[11px] sm:text-xs font-bold mt-0.5 tracking-wider">{isAdmin ? 'ADMIN' : 'PROFILE'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
