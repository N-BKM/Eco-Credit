import React, { useState } from 'react';
import { Leaf, Lock, BookOpen, ShieldCheck, ArrowRight, UserCheck, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CAMPUS_DEPARTMENTS } from '../constants/ecoConfig';

interface LoginPageProps {
  onSuccess: (role: 'student' | 'admin') => void;
  initialRole?: 'student' | 'admin' | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, initialRole = null }) => {
  const { login, signup } = useAuth();
  
  // Step State: 'role_selection' | 'student_login' | 'student_signup' | 'admin_login'
  const [authStep, setAuthStep] = useState<'role_selection' | 'student_login' | 'student_signup' | 'admin_login'>(
    initialRole === 'admin' ? 'admin_login' : initialRole === 'student' ? 'student_login' : 'role_selection'
  );

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [studentId, setStudentId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [department, setDepartment] = useState<string>(CAMPUS_DEPARTMENTS[0]);
  const [yearOfStudy, setYearOfStudy] = useState<string>('3rd Year (Junior)');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Admin Login Fields
  const [adminId, setAdminId] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');

  // Handle Student Login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (!studentId || !password) {
        setErrorMsg('Please enter both Student ID and Password.');
        setIsSubmitting(false);
        return;
      }
      const ok = await login(studentId, password, 'student');
      if (ok) {
        onSuccess('student');
      } else {
        setErrorMsg('Invalid Student ID or password. Please try again or create an account.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Student authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Student Registration
  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !studentId || !password || !confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await signup({
        full_name: fullName,
        student_id: studentId,
        year_of_study: yearOfStudy,
        department: department,
        password: password
      });

      if (ok) {
        onSuccess('student');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Student registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (!adminId || !adminPassword) {
        setErrorMsg('Please enter Admin ID and Password.');
        setIsSubmitting(false);
        return;
      }

      const ok = await login(adminId, adminPassword, 'admin');
      if (ok) {
        onSuccess('admin');
      } else {
        setErrorMsg('Invalid Admin credentials. Use seeded ID: ADMIN-2026-001 / Password: admin@ecocredit2026');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Admin authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09291F] flex items-center justify-center p-4 font-serif">
      <div className="w-full max-w-lg bg-[#0F3A2D] border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Gold Glow Accent */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#09291F] border border-[#D4AF37] mx-auto flex items-center justify-center shadow-lg mb-3">
            <Leaf className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Smart EcoCredit Portal
          </h1>
          <p className="text-xs text-[#E6C65C] mt-1">
            Campus Waste Management & EcoCredit Rewards
          </p>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-500/50 rounded-2xl text-xs text-red-200 text-center flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: ROLE SELECTION */}
        {authStep === 'role_selection' && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white">Select Your Access Portal</h2>
              <p className="text-xs text-[#E8E8E8]/70 mt-0.5">Choose your role to log in or register</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Role Card */}
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setAuthStep('student_login'); }}
                className="group bg-[#09291F] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-2xl p-6 text-center transition-all hover:scale-105 shadow-xl cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0F3A2D] border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform shadow">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  STUDENT
                </h3>
                <p className="text-xs text-[#E8E8E8]/70 mt-1">
                  Dispose waste, earn EcoCredits, and redeem campus rewards.
                </p>
              </button>

              {/* Admin Role Card */}
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setAuthStep('admin_login'); }}
                className="group bg-[#09291F] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-2xl p-6 text-center transition-all hover:scale-105 shadow-xl cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0F3A2D] border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform shadow">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  ADMINISTRATOR
                </h3>
                <p className="text-xs text-[#E8E8E8]/70 mt-1">
                  Access college analytics, bin fill telemetry, and participation logs.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2A: STUDENT LOGIN FORM */}
        {authStep === 'student_login' && (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[#D4AF37]" />
                <span>Student Login</span>
              </h2>
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setAuthStep('role_selection'); }}
                className="text-xs text-[#E6C65C] hover:underline"
              >
                Change Role
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1.5">
                Student ID *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter Student ID"
                  className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Student'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-[#D4AF37]/20 text-center">
              <span className="text-xs text-[#E8E8E8]/70">Don't have a student account yet? </span>
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setAuthStep('student_signup'); }}
                className="text-xs font-bold text-[#D4AF37] hover:underline"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* STEP 2B: STUDENT SIGNUP FORM */}
        {authStep === 'student_signup' && (
          <form onSubmit={handleStudentSignup} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[#D4AF37]" />
                <span>Create Student Account</span>
              </h2>
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setAuthStep('student_login'); }}
                className="text-xs text-[#E6C65C] hover:underline"
              >
                Existing Student? Sign In
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                Student ID *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID"
                className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {CAMPUS_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-[#09291F] text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                  Year of Studying *
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                  <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                  <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                  <option value="4th Year (Senior)">4th Year (Senior)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-4 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl px-4 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration (+20 CR Bonus)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2C: ADMIN LOGIN FORM */}
        {authStep === 'admin_login' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <span>Administrator Sign In</span>
              </h2>
              <button
                type="button"
                onClick={() => { setErrorMsg(''); setAuthStep('role_selection'); }}
                className="text-xs text-[#E6C65C] hover:underline"
              >
                Change Role
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1.5">
                Admin ID *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter Admin ID"
                  className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E6C65C] uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-[#09291F] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>{isSubmitting ? 'Authenticating Admin...' : 'Access Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
