-- Smart Campus Waste Disposal & EcoCredit System Database Schema Migration
-- Enables extensions and creates tables, constraints, indexes, and RLS policies.

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    student_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Bins Table
CREATE TABLE IF NOT EXISTS public.bins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    location_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Recyclable', 'Organic', 'E-Waste', 'Glass', 'All'
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    qr_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'full', 'maintenance'
    fill_percentage INT DEFAULT 40 CHECK (fill_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Waste Disposals Table
CREATE TABLE IF NOT EXISTS public.waste_disposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bin_id UUID NOT NULL REFERENCES public.bins(id) ON DELETE RESTRICT,
    waste_category TEXT NOT NULL,
    ai_confidence REAL NOT NULL CHECK (ai_confidence BETWEEN 0 AND 100),
    image_url TEXT,
    credits_awarded INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    verified_at TIMESTAMPTZ
);

-- 4. Wallet Transactions Table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('credited', 'redeemed')),
    amount INT NOT NULL,
    description TEXT NOT NULL,
    related_disposal_id UUID REFERENCES public.waste_disposals(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Rewards Table
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    cost_credits INT NOT NULL CHECK (cost_credits > 0),
    category TEXT NOT NULL, -- 'Food & Dining', 'Academic', 'Merchandise', 'Campus Services'
    active BOOLEAN DEFAULT TRUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Reward Redemptions Table
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE RESTRICT,
    redemption_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES for fast querying
CREATE INDEX IF NOT EXISTS idx_disposals_student ON public.waste_disposals(student_id);
CREATE INDEX IF NOT EXISTS idx_disposals_date ON public.waste_disposals(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_student ON public.wallet_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_bins_qr ON public.bins(qr_code);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_disposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Students can view all profiles (needed for leaderboard), but can only update their own
CREATE POLICY "Public profiles reading for leaderboard" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Bins: Public read access for all authenticated users
CREATE POLICY "Bins are publicly readable" ON public.bins FOR SELECT USING (true);

-- Waste Disposals: Students view & insert their own disposals
CREATE POLICY "Users view own disposals" ON public.waste_disposals FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users insert own disposals" ON public.waste_disposals FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users update own disposals" ON public.waste_disposals FOR UPDATE USING (auth.uid() = student_id);

-- Wallet Transactions: Students view & insert their own transactions
CREATE POLICY "Users view own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users insert own transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Rewards: Public read access
CREATE POLICY "Rewards are publicly readable" ON public.rewards FOR SELECT USING (true);

-- Reward Redemptions: Students view & create their own redemptions
CREATE POLICY "Users view own redemptions" ON public.reward_redemptions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users create own redemptions" ON public.reward_redemptions FOR INSERT WITH CHECK (auth.uid() = student_id);
