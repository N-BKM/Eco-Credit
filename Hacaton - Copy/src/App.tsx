import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopHeader } from './components/Navigation/TopHeader';
import { CradledBottomNav } from './components/Navigation/CradledBottomNav';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { WalletPage } from './pages/WalletPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const { isAuthenticated, isAdmin, user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedRoleHint, setSelectedRoleHint] = useState<'student' | 'admin' | null>(null);
  const [routeGuardError, setRouteGuardError] = useState<string>('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09291F] flex items-center justify-center font-serif text-[#D4AF37]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-bold tracking-wider">Loading Smart EcoCredit System...</p>
        </div>
      </div>
    );
  }

  // Handle Tab Switch with Strict Role Route Guards
  const handleTabChange = (tab: string) => {
    setRouteGuardError('');

    // Check if user is attempting to access Admin Portal
    if (tab === 'admin') {
      if (!isAuthenticated) {
        setSelectedRoleHint('admin');
        setCurrentTab('auth');
        return;
      }
      if (user?.role !== 'admin' && !isAdmin) {
        setRouteGuardError('Access Denied: Admin Portal requires Administrator credentials. Redirecting to Student Dashboard.');
        setCurrentTab('home');
        return;
      }
    }

    setCurrentTab(tab);
  };

  // Signing Screen (/auth) - ALWAYS render LoginPage when currentTab is 'auth'
  if (currentTab === 'auth') {
    return (
      <LoginPage
        initialRole={selectedRoleHint}
        onSuccess={(role) => {
          if (role === 'admin') {
            setCurrentTab('admin');
          } else {
            setCurrentTab('home');
          }
        }}
      />
    );
  }

  // Landing Page
  if (currentTab === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          setSelectedRoleHint(null);
          setCurrentTab('auth');
        }}
        onOpenAdmin={() => {
          setSelectedRoleHint('admin');
          setCurrentTab('auth');
        }}
      />
    );
  }

  // Unauthenticated user attempting protected tab
  if (!isAuthenticated) {
    return (
      <LoginPage
        initialRole={selectedRoleHint}
        onSuccess={(role) => setCurrentTab(role === 'admin' ? 'admin' : 'home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09291F] text-white font-serif relative">
      
      {/* Top Sticky Header */}
      <TopHeader 
        onTabChange={handleTabChange} 
        isAdminView={isAdmin || user?.role === 'admin'}
        setIsAdminView={() => handleTabChange(user?.role === 'admin' ? 'admin' : 'home')}
      />

      {/* Route Guard Notification Alert */}
      {routeGuardError && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-4 bg-red-950/90 border border-red-500 rounded-2xl text-xs text-red-200 text-center flex items-center justify-between shadow-xl">
            <span>{routeGuardError}</span>
            <button onClick={() => setRouteGuardError('')} className="text-red-400 font-bold ml-4">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Centered Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
        {currentTab === 'home' && <DashboardPage onNavigate={handleTabChange} />}
        {currentTab === 'scanner' && <ScannerPage onDisposalSuccess={() => handleTabChange('wallet')} />}
        {currentTab === 'wallet' && <WalletPage />}
        {currentTab === 'leaderboard' && <LeaderboardPage />}
        {currentTab === 'profile' && <ProfilePage />}
        {currentTab === 'admin' && (
          user?.role === 'admin' ? (
            <AdminPage />
          ) : (
            <div className="p-8 text-center text-red-300">
              Access Denied: Only administrators can access this view.
            </div>
          )
        )}
      </main>

      {/* Cradled Floating Bottom Nav */}
      <CradledBottomNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        isAdmin={user?.role === 'admin'}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
