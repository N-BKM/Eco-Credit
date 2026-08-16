import React, { useState } from 'react';
import { Trophy, Users, GraduationCap, Medal } from 'lucide-react';
import { MOCK_STUDENT_LEADERBOARD, MOCK_DEPT_LEADERBOARD } from '../constants/mockData';
import { useAuth } from '../context/AuthContext';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'student' | 'dept'>('student');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-serif">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-[#09291F] border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] shadow-xl mb-4">
          <Trophy className="w-9 h-9 stroke-[2]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
          Green Campus Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-[#E6C65C] mt-1 max-w-lg mx-auto">
          Honoring the top eco-warriors and department teams driving sustainable campus waste management.
        </p>

        {/* 2. SECONDARY CRADLED FLOATING SWITCHER CONTROL ("STUDENT | DEPARTMENT") */}
        <div className="mt-6 inline-flex bg-[#09291F] border-2 border-[#D4AF37]/60 rounded-full p-1.5 shadow-xl">
          <button
            onClick={() => setViewMode('student')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === 'student'
                ? 'eco-gold-gradient text-[#09291F] shadow-md scale-105'
                : 'text-[#E8E8E8]/70 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>STUDENT RANKINGS</span>
          </button>
          
          <button
            onClick={() => setViewMode('dept')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === 'dept'
                ? 'eco-gold-gradient text-[#09291F] shadow-md scale-105'
                : 'text-[#E8E8E8]/70 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>DEPARTMENT RANKINGS</span>
          </button>
        </div>

      </div>

      {/* 3. STUDENT RANKINGS VIEW */}
      {viewMode === 'student' && (
        <div className="space-y-4">
          
          {/* Top 3 Medallion Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Rank 2 - Silver/Light Gold */}
            {MOCK_STUDENT_LEADERBOARD[1] && (
              <div className="order-2 md:order-1 bg-[#0F3A2D] border-2 border-[#E6C65C]/60 rounded-3xl p-5 text-center relative shadow-xl">
                <div className="w-10 h-10 rounded-full bg-[#E6C65C] text-[#09291F] font-bold text-base flex items-center justify-center mx-auto -mt-8 border-2 border-[#09291F] shadow-md">
                  #2
                </div>
                <img src={MOCK_STUDENT_LEADERBOARD[1].avatar_url} alt="Rank 2" className="w-16 h-16 rounded-full mx-auto my-3 border-2 border-[#E6C65C] object-cover" />
                <h3 className="text-base font-bold text-white line-clamp-1">{MOCK_STUDENT_LEADERBOARD[1].name}</h3>
                <p className="text-[11px] text-[#E6C65C] font-bold">{MOCK_STUDENT_LEADERBOARD[1].department}</p>
                <div className="mt-3 text-lg font-bold text-[#E6C65C]">
                  {MOCK_STUDENT_LEADERBOARD[1].credits} <span className="text-xs text-[#E8E8E8]/70">CR</span>
                </div>
              </div>
            )}

            {/* Rank 1 - Gold Treatment */}
            {MOCK_STUDENT_LEADERBOARD[0] && (
              <div className="order-1 md:order-2 bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 text-center relative shadow-2xl scale-105 bg-gradient-to-b from-[#0F3A2D] to-[#144838]">
                <div className="w-12 h-12 rounded-full eco-gold-gradient text-[#09291F] font-bold text-xl flex items-center justify-center mx-auto -mt-9 border-2 border-[#09291F] shadow-lg">
                  👑 #1
                </div>
                <img src={MOCK_STUDENT_LEADERBOARD[0].avatar_url} alt="Rank 1" className="w-20 h-20 rounded-full mx-auto my-3 border-2 border-[#D4AF37] object-cover shadow-gold" />
                <h3 className="text-lg font-bold text-white line-clamp-1">{MOCK_STUDENT_LEADERBOARD[0].name}</h3>
                <p className="text-xs text-[#D4AF37] font-bold">{MOCK_STUDENT_LEADERBOARD[0].department}</p>
                <div className="mt-3 text-2xl font-bold text-[#D4AF37]">
                  {MOCK_STUDENT_LEADERBOARD[0].credits} <span className="text-xs text-[#E6C65C]">CR</span>
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {MOCK_STUDENT_LEADERBOARD[2] && (
              <div className="order-3 bg-[#0F3A2D] border-2 border-amber-600/60 rounded-3xl p-5 text-center relative shadow-xl">
                <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-bold text-base flex items-center justify-center mx-auto -mt-8 border-2 border-[#09291F] shadow-md">
                  #3
                </div>
                <img src={MOCK_STUDENT_LEADERBOARD[2].avatar_url} alt="Rank 3" className="w-16 h-16 rounded-full mx-auto my-3 border-2 border-amber-600 object-cover" />
                <h3 className="text-base font-bold text-white line-clamp-1">{MOCK_STUDENT_LEADERBOARD[2].name}</h3>
                <p className="text-[11px] text-amber-400 font-bold">{MOCK_STUDENT_LEADERBOARD[2].department}</p>
                <div className="mt-3 text-lg font-bold text-amber-400">
                  {MOCK_STUDENT_LEADERBOARD[2].credits} <span className="text-xs text-[#E8E8E8]/70">CR</span>
                </div>
              </div>
            )}

          </div>

          {/* Ranks 4 to 10 Table */}
          <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-3">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Medal className="w-5 h-5 text-[#D4AF37]" />
              <span>Top 10 Eco Champions</span>
            </h3>

            {MOCK_STUDENT_LEADERBOARD.slice(3).map((student) => {
              const isCurrentUser = student.is_current_user || student.student_id === user?.student_id;
              return (
                <div
                  key={student.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isCurrentUser
                      ? 'bg-[#09291F] border-2 border-[#D4AF37] shadow-xl'
                      : 'bg-[#09291F]/70 border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCurrentUser ? 'bg-[#D4AF37] text-[#09291F]' : 'bg-[#0F3A2D] text-[#E6C65C] border border-[#D4AF37]/30'
                    }`}>
                      #{student.rank}
                    </span>
                    <img src={student.avatar_url} alt={student.name} className="w-10 h-10 rounded-full border border-[#D4AF37]/40 object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{student.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold">
                            YOU
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-[#E8E8E8]/70">{student.department}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-[#D4AF37]">{student.credits} CR</span>
                    <span className="text-[10px] text-[#E8E8E8]/60 block">{student.disposals_count} Disposals</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. DEPARTMENT RANKINGS VIEW */}
      {viewMode === 'dept' && (
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
              <span>Department Cumulative EcoCredits</span>
            </h3>
          </div>

          <div className="space-y-3">
            {MOCK_DEPT_LEADERBOARD.map((dept) => (
              <div 
                key={dept.rank}
                className="p-5 bg-[#09291F] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    dept.rank === 1 ? 'eco-gold-gradient text-[#09291F]' : 'bg-[#0F3A2D] text-[#D4AF37] border border-[#D4AF37]/40'
                  }`}>
                    #{dept.rank}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{dept.department}</h4>
                    <p className="text-xs text-[#E8E8E8]/70 mt-0.5">
                      {dept.active_students} Active Students • {dept.total_disposals} Verified Recycles
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-2xl font-bold text-[#D4AF37]">{dept.total_credits}</span>
                  <span className="text-xs text-[#E6C65C] ml-1 font-bold">Credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
