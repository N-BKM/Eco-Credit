import React from 'react';
import { 
  Leaf, Scan, MapPin, QrCode, Award, ShoppingBag, Shield, 
  ArrowRight, Sparkles, TrendingUp
} from 'lucide-react';
import { WASTE_CREDIT_VALUES } from '../constants/ecoConfig';
import { MOCK_DEPT_LEADERBOARD } from '../constants/mockData';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAdmin }) => {

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#09291F] text-white font-serif selection:bg-[#D4AF37] selection:text-[#09291F]">
      
      {/* LANDING HEADER */}
      <header className="sticky top-0 z-50 bg-[#0F3A2D]/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#09291F] border border-[#D4AF37] flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-wider block">Smart EcoCredit</span>
              <span className="text-[11px] text-[#E6C65C] block">Campus Waste Disposal & Rewards</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-lg border border-[#D4AF37]/40 text-[#E6C65C] hover:bg-[#D4AF37]/10 text-sm font-bold transition-all hidden sm:block"
            >
              Admin Dashboard
            </button>
            <button
              onClick={onEnterApp}
              className="px-5 py-2.5 rounded-lg eco-gold-gradient text-[#09291F] font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>Launch Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#0F3A2D] border border-[#D4AF37]/50 rounded-full px-4 py-1.5 mb-8 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#E6C65C] tracking-wider uppercase">
              AI-Powered Closed-Loop Campus Sustainability
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Identify <span className="text-[#D4AF37]">→</span> Locate <span className="text-[#D4AF37]">→</span> Dispose <span className="text-[#D4AF37]">→</span> Verify <span className="text-[#D4AF37]">→</span> Reward <span className="text-[#D4AF37]">→</span> Analyze
          </h1>

          <p className="text-lg sm:text-xl text-[#E8E8E8]/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            Turn everyday responsible waste management into instant campus rewards. Scan waste with AI, navigate to designated smart bins, verify disposal via QR & IoT sensors, and earn <strong className="text-[#D4AF37]">EcoCredits</strong> for discounts, printing credits, and merchandise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-3"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F3A2D] border border-[#D4AF37]/60 text-[#D4AF37] font-bold text-lg hover:bg-[#0F3A2D]/80 transition-all flex items-center justify-center space-x-2"
            >
              <span>See How It Works</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM / WHY SECTION */}
      <section className="py-20 px-6 bg-[#0F3A2D]/60 border-y border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Smart Waste Management Matters
            </h2>
            <p className="text-base sm:text-lg text-[#E6C65C] max-w-2xl mx-auto">
              Bridging the gap between environmental responsibility and student incentive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Campus Misclassification</h3>
              <p className="text-sm text-[#E8E8E8]/80 leading-relaxed">
                Over 65% of recyclable campus waste ends up in landfills due to confusing bin labels and lack of instant categorization guidance.
              </p>
            </div>

            <div className="bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Reward Incentive</h3>
              <p className="text-sm text-[#E8E8E8]/80 leading-relaxed">
                Students lack tangible motivation to properly segregate organic, e-waste, and recyclable materials during daily campus life.
              </p>
            </div>

            <div className="bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl p-8 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verified EcoCredit System</h3>
              <p className="text-sm text-[#E8E8E8]/80 leading-relaxed">
                Our AI + QR system verifies physical disposal at designated smart bins before awarding credits, ensuring 100% accountable recycling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase block mb-2">COMPLETE WORKFLOW</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white">How The Closed Loop Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Find Waste', desc: 'Locate recyclable, organic, e-waste, or glass item on campus.', icon: Scan },
              { step: '02', title: 'AI Classification', desc: 'Snap photo for instant multimodal AI vision category & confidence score.', icon: Sparkles },
              { step: '03', title: 'Locate Bin', desc: 'View nearby matching campus bins with real-time capacity meters.', icon: MapPin },
              { step: '04', title: 'Dispose & Scan QR', desc: 'Drop waste in designated bin and scan the bin’s secure QR code.', icon: QrCode },
              { step: '05', title: 'Verified Credit', desc: 'Disposal verified, EcoCredits calculated & credited to wallet.', icon: Award },
              { step: '06', title: 'Redeem Rewards', desc: 'Exchange EcoCredits for campus canteen vouchers, prints & merch.', icon: ShoppingBag }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-2xl p-6 relative hover:border-[#D4AF37] transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#09291F] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#E8E8E8]/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES GRID */}
      <section className="py-20 px-6 bg-[#0F3A2D]/40 border-y border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Engineered For Scale</h2>
            <p className="text-base text-[#E6C65C]">Enterprise-grade campus waste management features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl">
              <Sparkles className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Multimodal AI Vision</h3>
              <p className="text-sm text-[#E8E8E8]/80">Hosted server-side vision AI model classifies materials with high confidence score verification.</p>
            </div>
            <div className="p-6 bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl">
              <QrCode className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Verified Disposal (QR + Sensor)</h3>
              <p className="text-sm text-[#E8E8E8]/80">Eliminates self-reporting fraud by validating physical bin QR scans and simulated sensor confirmation.</p>
            </div>
            <div className="p-6 bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl">
              <Award className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">EcoCredit Wallet & Daily Cap</h3>
              <p className="text-sm text-[#E8E8E8]/80">Real-time ledger tracking credits, daily 3-disposal limit guardrails, and audit history.</p>
            </div>
            <div className="p-6 bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Department Leaderboards</h3>
              <p className="text-sm text-[#E8E8E8]/80">Student and department aggregate rankings fostering healthy campus sustainability competition.</p>
            </div>
            <div className="p-6 bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl">
              <ShoppingBag className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Campus Rewards Store</h3>
              <p className="text-sm text-[#E8E8E8]/80">One-time QR redemption codes for canteen discounts, printing quotas, and sustainable merchandise.</p>
            </div>
            <div className="p-6 bg-[#09291F] border border-[#D4AF37]/30 rounded-2xl">
              <Shield className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Admin Analytics Portal</h3>
              <p className="text-sm text-[#E8E8E8]/80">Live Recharts dashboards showing total disposals, category breakdown, and bin capacity hotspots.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ECOCREDIT VALUES & SAMPLE WALLET */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <span className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase block mb-2">TRANSPARENT REWARDS</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">EcoCredit Exchange Rates</h2>
              <p className="text-base text-[#E8E8E8]/80 mb-8 leading-relaxed">
                Different waste categories yield specialized EcoCredit values based on their recycling complexity and environmental impact.
              </p>

              <div className="space-y-3">
                {Object.entries(WASTE_CREDIT_VALUES).slice(0, 5).map(([cat, info]) => (
                  <div key={cat} className="flex items-center justify-between p-3.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                      <span className="text-sm font-bold text-white">{info.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#D4AF37]">+{info.credits}</span>
                      <span className="text-xs text-[#E6C65C] ml-1">Credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Wallet Balance Card */}
            <div className="bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-[#E6C65C] tracking-widest uppercase block">SAMPLE STUDENT WALLET</span>
                  <h3 className="text-xl font-bold text-white">Aarav Sharma</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#09291F] border border-[#D4AF37] flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#D4AF37]" />
                </div>
              </div>

              <div className="bg-[#09291F] border border-[#D4AF37]/40 rounded-2xl p-6 mb-6">
                <span className="text-xs text-[#E8E8E8]/70 block mb-1">TOTAL BALANCE</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold text-[#D4AF37]">245</span>
                  <span className="text-lg font-bold text-[#E6C65C]">EcoCredits</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-[#E8E8E8]/80 border-t border-[#D4AF37]/20 pt-4">
                <span>Daily Limit: 2 / 3 Rewarded Today</span>
                <span className="text-[#D4AF37] font-bold">Level: Gold Recycler</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. LEADERBOARD PREVIEW */}
      <section className="py-20 px-6 bg-[#0F3A2D]/60 border-t border-[#D4AF37]/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Green Campus Leaderboard</h2>
          <p className="text-sm text-[#E6C65C] mb-10">Top performing departments driving campus sustainability.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {MOCK_DEPT_LEADERBOARD.slice(0, 3).map((dept) => (
              <div key={dept.rank} className="bg-[#09291F] border border-[#D4AF37]/40 rounded-2xl p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    RANK #{dept.rank}
                  </span>
                  <span className="text-2xl font-bold text-[#D4AF37]">{dept.total_credits} CR</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{dept.department}</h3>
                <p className="text-xs text-[#E8E8E8]/70">{dept.total_disposals} Verified Disposals</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TECH STACK STRIP */}
      <section className="py-12 px-6 border-t border-[#D4AF37]/20 bg-[#09291F]">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold text-[#E6C65C] tracking-widest uppercase block mb-6">COMMITTED TECH STACK</span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-white/80">
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">React 19</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">Vite</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">TypeScript</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">Tailwind CSS</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">Supabase Postgres</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">Supabase Edge Functions</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">Row-Level Security (RLS)</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">Multimodal Vision AI</span>
            <span className="px-3 py-1.5 bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-lg">Recharts</span>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 px-6 bg-[#061A14] border-t border-[#D4AF37]/30 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-lg font-bold text-white">Smart Campus Waste Disposal System</span>
          </div>
          <p className="text-xs text-[#E8E8E8]/70 mb-6 max-w-lg mx-auto">
            Empowering students, verifying disposal, and sustaining green university ecosystems through closed-loop AI architecture.
          </p>
          <div className="text-xs text-[#D4AF37]/80">
            © 2026 Antigravity EcoTech Team • All Rights Reserved
          </div>
        </div>
      </footer>

    </div>
  );
};
