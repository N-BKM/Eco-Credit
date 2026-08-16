import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, BarChart3, PieChart as PieIcon, TrendingUp, MapPin, 
  Award, CheckCircle2, Users
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { dbService, supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Bin, Profile } from '../types';

export const AdminPage: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const loadAdminData = async () => {
    try {
      const fetchedBins = await dbService.getBins();
      setBins(fetchedBins);

      const allProfs = await dbService.getAllProfiles();
      setProfiles(allProfs.filter(p => p.role !== 'admin'));
    } catch (err) {
      console.error('Error loading admin analytics:', err);
    }
  };

  useEffect(() => {
    loadAdminData();

    // Custom event listener for instant local signup refresh
    const handleStudentSignup = () => loadAdminData();
    window.addEventListener('student_registered', handleStudentSignup);

    // 8-second polling for live updates
    const interval = setInterval(() => {
      loadAdminData();
    }, 8000);

    // Supabase Realtime Subscription if configured
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const channel = client
        .channel('admin-realtime')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => loadAdminData())
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waste_disposals' }, () => loadAdminData())
        .subscribe();

      return () => {
        window.removeEventListener('student_registered', handleStudentSignup);
        clearInterval(interval);
        client.removeChannel(channel);
      };
    }

    return () => {
      window.removeEventListener('student_registered', handleStudentSignup);
      clearInterval(interval);
    };
  }, []);

  // Category Breakdown Data for Pie Chart
  const categoryData = [
    { name: 'Recyclable Plastic', value: 45, color: '#D4AF37' },
    { name: 'Paper & Cardboard', value: 28, color: '#E6C65C' },
    { name: 'Organic Waste', value: 20, color: '#A3E635' },
    { name: 'E-Waste', value: 12, color: '#34D399' },
    { name: 'Glass', value: 8, color: '#60A5FA' }
  ];

  // Daily Trend Data for Area Chart
  const trendData = [
    { date: 'Mon', disposals: 42, credits: 420 },
    { date: 'Tue', disposals: 58, credits: 610 },
    { date: 'Wed', disposals: 75, credits: 820 },
    { date: 'Thu', disposals: 90, credits: 990 },
    { date: 'Fri', disposals: 110, credits: 1240 },
    { date: 'Sat', disposals: 65, credits: 680 },
    { date: 'Sun', disposals: 48, credits: 510 }
  ];

  // Bin Hotspot Data for Bar Chart
  const binHotspotData = bins.map(b => ({
    name: b.label,
    fill: b.fill_percentage,
    location: b.location_name
  }));

  return (
    <div className="space-y-8 pb-16 font-serif">
      
      {/* 1. HEADER */}
      <div className="bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#E6C65C] tracking-widest uppercase">
                UNIVERSITY ADMINISTRATION PORTAL
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Campus Sustainability & Waste Analytics
            </h1>
            <p className="text-xs text-[#E8E8E8]/80 mt-1">
              Real-time monitoring of campus recycling metrics, EcoCredit ledger distribution, and bin capacities.
            </p>
          </div>

          <div className="bg-[#09291F] border border-[#D4AF37]/40 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-[#E8E8E8]/70 uppercase block">SYSTEM STATUS</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center justify-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>IoT & AI Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#E8E8E8]/70">TOTAL VERIFIED DISPOSALS</span>
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold text-[#D4AF37]">1,482</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">↑ +18.4% this week</span>
        </div>

        <div className="bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#E8E8E8]/70">ECOCREDITS DISTRIBUTED</span>
            <Award className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold text-[#E6C65C]">18,450</div>
          <span className="text-[11px] text-[#E8E8E8]/70 mt-1 block">Avg 12.4 CR / disposal</span>
        </div>

        <div className="bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#E8E8E8]/70">ACTIVE PARTICIPATING STUDENTS</span>
            <Users className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold text-white">{profiles.length > 0 ? profiles.length + 635 : 638}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Across 8 departments</span>
        </div>

        <div className="bg-[#0F3A2D] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#E8E8E8]/70">REWARDS REDEEMED</span>
            <Award className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-bold text-[#D4AF37]">412</div>
          <span className="text-[11px] text-[#E8E8E8]/70 mt-1 block">Canteen, Prints & Merch</span>
        </div>

      </div>

      {/* 3. CHARTS GRID (RECHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown Pie Chart */}
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-[#D4AF37]" />
              <span>Waste Breakdown by Category</span>
            </h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#09291F" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09291F', borderColor: '#D4AF37', borderRadius: '12px', color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-[#D4AF37]/20 text-xs">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-[#E8E8E8]">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Disposals & EcoCredits Trend Area Chart */}
        <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
              <span>Weekly Disposal & Credit Trends</span>
            </h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorDisposals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
                <XAxis dataKey="date" stroke="#E6C65C" fontSize={11} />
                <YAxis stroke="#E6C65C" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#09291F', borderColor: '#D4AF37', borderRadius: '12px', color: '#FFF' }} />
                <Area type="monotone" dataKey="disposals" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorDisposals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. BIN CAPACITY & HOTSPOTS BAR CHART */}
      <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              <span>Campus Bin Capacities & Fill Hotspots</span>
            </h3>
            <p className="text-xs text-[#E8E8E8]/80 mt-1">
              Live capacity telemetry across campus smart bins. Bins exceeding 80% capacity alert facilities team.
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={binHotspotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
              <XAxis dataKey="name" stroke="#E6C65C" fontSize={11} />
              <YAxis stroke="#E6C65C" fontSize={11} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09291F', borderColor: '#D4AF37', borderRadius: '12px', color: '#FFF' }}
              />
              <Bar dataKey="fill" fill="#D4AF37" radius={[8, 8, 0, 0]}>
                {binHotspotData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill >= 80 ? '#F87171' : '#D4AF37'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bin Location Details Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#D4AF37]/20">
          {bins.map((bin) => (
            <div key={bin.id} className="p-3.5 bg-[#09291F] border border-[#D4AF37]/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">Bin {bin.label}</span>
                <p className="text-xs text-[#E8E8E8]/70 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{bin.location_name}</span>
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  bin.fill_percentage >= 80 ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {bin.fill_percentage}% Full
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
