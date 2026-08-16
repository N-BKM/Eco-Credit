import React, { useState } from 'react';
import { User, BookOpen, GraduationCap, Award, Calendar, ShieldCheck, LogOut, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../lib/supabase';
import { CAMPUS_DEPARTMENTS } from '../constants/ecoConfig';

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Edit Form Fields
  const [fullName, setFullName] = useState<string>(user?.full_name || '');
  const [department, setDepartment] = useState<string>(user?.department || CAMPUS_DEPARTMENTS[0]);
  const [yearOfStudy, setYearOfStudy] = useState<string>(user?.year_of_study || '3rd Year (Junior)');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dbService.updateProfile({
        full_name: fullName,
        department,
        year_of_study: yearOfStudy
      });
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 font-serif">
      
      {/* 1. DIGITAL STUDENT ID CARD */}
      <div className="relative bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#E6C65C] tracking-widest uppercase">
              OFFICIAL DIGITAL STUDENT ID
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40">
            VERIFIED ACTIVE
          </span>
        </div>

        {/* Profile Card Body */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
          
          {/* Avatar with Gold Circular Border */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 eco-gold-gradient shadow-2xl">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&q=80'}
                alt={user?.full_name || 'Student'}
                className="w-full h-full rounded-full object-cover border-2 border-[#09291F]"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#09291F] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow">
              <Award className="w-4 h-4" />
            </div>
          </div>

          {/* Student Info Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {user?.full_name || 'Aarav Sharma'}
              </h1>
              <p className="text-sm text-[#D4AF37] font-bold mt-0.5">
                {user?.student_id || 'CS2026-8942'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#D4AF37]/20">
              <div className="flex items-center space-x-2 text-[#E8E8E8]/90">
                <GraduationCap className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{user?.department || 'Computer Science & Engineering'}</span>
              </div>

              <div className="flex items-center space-x-2 text-[#E8E8E8]/90">
                <BookOpen className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{user?.year_of_study || '3rd Year (Junior)'}</span>
              </div>

              <div className="flex items-center space-x-2 text-[#E8E8E8]/90">
                <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Enrolled: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2024'}</span>
              </div>

              <div className="flex items-center space-x-2 text-[#E8E8E8]/90">
                <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Wallet Balance: <strong className="text-[#D4AF37]">{user?.eco_credits || 0} CR</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 2. EDIT PROFILE OR SETTINGS FORM */}
      <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <User className="w-5 h-5 text-[#D4AF37]" />
            <span>Student Profile Details</span>
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-[#D4AF37]/40 text-[#E6C65C] hover:bg-[#09291F] text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              >
                {CAMPUS_DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="bg-[#09291F] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                Year of Study
              </label>
              <input
                type="text"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-xs shadow hover:scale-105 transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-sm text-[#E8E8E8]/80">
            <p>Your profile data is tied to your authenticated student record and displayed across campus leaderboards and eco-credit receipts.</p>
            <div className="pt-4 border-t border-[#D4AF37]/20 flex justify-end">
              <button
                onClick={logout}
                className="px-5 py-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900 text-xs font-bold flex items-center space-x-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
