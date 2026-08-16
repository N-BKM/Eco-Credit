import type { Bin, Reward, LeaderboardStudent, LeaderboardDept, Profile, WasteDisposal, WalletTransaction } from '../types';

export const INITIAL_USER_PROFILE: Profile = {
  id: 'usr-demo-001',
  full_name: 'Aarav Sharma',
  student_id: 'CS2026-8942',
  department: 'Computer Science & Engineering',
  year_of_study: '3rd Year (Junior)',
  role: 'student',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  eco_credits: 245
};

export const MOCK_ADMIN_PROFILE: Profile = {
  id: 'usr-admin-001',
  full_name: 'Chief Campus Administrator',
  student_id: 'ADMIN-2026-001',
  department: 'Campus Environmental Facilities',
  year_of_study: 'Staff Administration',
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  created_at: new Date(Date.now() - 365 * 86400000).toISOString(),
  eco_credits: 0
};

export const MOCK_BINS: Bin[] = [
  {
    id: 'bin-001',
    label: 'RB-01',
    location_name: 'Block A Ground Floor Entrance',
    category: 'Recyclable',
    latitude: 12.9716,
    longitude: 77.5946,
    qr_code: 'BIN-RB01-BLOCKA',
    status: 'active',
    fill_percentage: 45,
    created_at: new Date().toISOString(),
    distance_m: 85
  },
  {
    id: 'bin-002',
    label: 'RB-04',
    location_name: 'Central Canteen Food Court',
    category: 'Organic',
    latitude: 12.9720,
    longitude: 77.5950,
    qr_code: 'BIN-RB04-CANTEEN',
    status: 'active',
    fill_percentage: 82,
    created_at: new Date().toISOString(),
    distance_m: 140
  },
  {
    id: 'bin-003',
    label: 'RB-07',
    location_name: 'University Library Lobby',
    category: 'Paper',
    latitude: 12.9712,
    longitude: 77.5940,
    qr_code: 'BIN-RB07-LIBRARY',
    status: 'active',
    fill_percentage: 30,
    created_at: new Date().toISOString(),
    distance_m: 210
  },
  {
    id: 'bin-004',
    label: 'EB-02',
    location_name: 'Engineering Block 3 - Electronics Lab',
    category: 'E-Waste',
    latitude: 12.9725,
    longitude: 77.5955,
    qr_code: 'BIN-EB02-ENGLAB',
    status: 'active',
    fill_percentage: 60,
    created_at: new Date().toISOString(),
    distance_m: 320
  },
  {
    id: 'bin-005',
    label: 'GB-05',
    location_name: 'Science Quadrangle Courtyard',
    category: 'Glass',
    latitude: 12.9718,
    longitude: 77.5948,
    qr_code: 'BIN-GB05-SCIENCE',
    status: 'active',
    fill_percentage: 25,
    created_at: new Date().toISOString(),
    distance_m: 175
  },
  {
    id: 'bin-006',
    label: 'MB-09',
    location_name: 'Student Activity Center',
    category: 'All',
    latitude: 12.9722,
    longitude: 77.5952,
    qr_code: 'BIN-MB09-SACENTER',
    status: 'active',
    fill_percentage: 70,
    created_at: new Date().toISOString(),
    distance_m: 410
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'rew-001',
    name: 'Campus Canteen 20% Discount Voucher',
    description: 'Valid for any lunch, beverage, or snack order at Central Canteen food court.',
    cost_credits: 100,
    category: 'Food & Dining',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'rew-002',
    name: 'Library Printing Credits (50 Pages)',
    description: 'Free high-quality B&W and color printouts at Central Library printing center.',
    cost_credits: 50,
    category: 'Academic',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=500&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'rew-003',
    name: 'Eco-Friendly Stainless Water Bottle',
    description: 'Limited edition campus branded double-wall insulated stainless steel flask.',
    cost_credits: 300,
    category: 'Merchandise',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'rew-004',
    name: 'Organic Campus Coffee Pass (3 Cups)',
    description: 'Redeemable for artisanal brewed coffees at Campus Roastery Coffee Shop.',
    cost_credits: 120,
    category: 'Food & Dining',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'rew-005',
    name: 'Campus Gym Priority Locker Access',
    description: '1-month reserved locker reservation at University Recreation Gym.',
    cost_credits: 200,
    category: 'Campus Services',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
    created_at: new Date().toISOString()
  }
];

export const MOCK_STUDENT_LEADERBOARD: LeaderboardStudent[] = [
  {
    rank: 1,
    id: 'usr-101',
    name: 'Ananya Verma',
    student_id: 'CS2025-1102',
    department: 'Computer Science & Engineering',
    credits: 840,
    disposals_count: 78,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
  },
  {
    rank: 2,
    id: 'usr-102',
    name: 'Rohan Kulkarni',
    student_id: 'EC2026-4491',
    department: 'Electronics & Communication',
    credits: 760,
    disposals_count: 65,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
  },
  {
    rank: 3,
    id: 'usr-103',
    name: 'Priya Sundaram',
    student_id: 'BT2026-9012',
    department: 'Biotechnology & Eco-Tech',
    credits: 690,
    disposals_count: 59,
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80'
  },
  {
    rank: 4,
    id: 'usr-demo-001',
    name: 'Aarav Sharma (You)',
    student_id: 'CS2026-8942',
    department: 'Computer Science & Engineering',
    credits: 245,
    disposals_count: 24,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    is_current_user: true
  },
  {
    rank: 5,
    id: 'usr-105',
    name: 'Vikram Mehta',
    student_id: 'ME2025-3319',
    department: 'Mechanical Engineering',
    credits: 210,
    disposals_count: 19,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80'
  },
  {
    rank: 6,
    id: 'usr-106',
    name: 'Sneha Patel',
    student_id: 'CE2027-5820',
    department: 'Civil & Environmental Science',
    credits: 195,
    disposals_count: 17,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
  },
  {
    rank: 7,
    id: 'usr-107',
    name: 'Devansh Reddy',
    student_id: 'MBA2026-004',
    department: 'Business Administration (MBA)',
    credits: 180,
    disposals_count: 15,
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80'
  },
  {
    rank: 8,
    id: 'usr-108',
    name: 'Kavya Nair',
    student_id: 'PH2026-1188',
    department: 'Physics & Material Sciences',
    credits: 165,
    disposals_count: 14,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
  },
  {
    rank: 9,
    id: 'usr-109',
    name: 'Karan Singhania',
    student_id: 'CS2027-7721',
    department: 'Computer Science & Engineering',
    credits: 150,
    disposals_count: 12,
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80'
  },
  {
    rank: 10,
    id: 'usr-110',
    name: 'Tanya Banerjee',
    student_id: 'HS2026-6610',
    department: 'Humanities & Social Sciences',
    credits: 140,
    disposals_count: 11,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
  }
];

export const MOCK_DEPT_LEADERBOARD: LeaderboardDept[] = [
  {
    rank: 1,
    department: 'Computer Science & Engineering',
    total_credits: 4250,
    total_disposals: 410,
    active_students: 142
  },
  {
    rank: 2,
    department: 'Biotechnology & Eco-Tech',
    total_credits: 3890,
    total_disposals: 365,
    active_students: 118
  },
  {
    rank: 3,
    department: 'Electronics & Communication',
    total_credits: 3120,
    total_disposals: 290,
    active_students: 95
  },
  {
    rank: 4,
    department: 'Civil & Environmental Science',
    total_credits: 2840,
    total_disposals: 260,
    active_students: 88
  },
  {
    rank: 5,
    department: 'Mechanical Engineering',
    total_credits: 2410,
    total_disposals: 225,
    active_students: 76
  },
  {
    rank: 6,
    department: 'Business Administration (MBA)',
    total_credits: 1980,
    total_disposals: 180,
    active_students: 62
  },
  {
    rank: 7,
    department: 'Physics & Material Sciences',
    total_credits: 1650,
    total_disposals: 150,
    active_students: 49
  },
  {
    rank: 8,
    department: 'Humanities & Social Sciences',
    total_credits: 1320,
    total_disposals: 120,
    active_students: 38
  }
];

export const MOCK_RECENT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-001',
    student_id: 'usr-demo-001',
    type: 'credited',
    amount: 10,
    description: 'Verified disposal of Plastic Bottle at Bin RB-01',
    status: 'completed',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'tx-002',
    student_id: 'usr-demo-001',
    type: 'credited',
    amount: 25,
    description: 'Verified disposal of Old Li-Ion Battery at Bin EB-02',
    status: 'completed',
    created_at: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: 'tx-003',
    student_id: 'usr-demo-001',
    type: 'redeemed',
    amount: 50,
    description: 'Redeemed Library Printing Credits (50 Pages)',
    status: 'completed',
    created_at: new Date(Date.now() - 28 * 3600000).toISOString()
  },
  {
    id: 'tx-004',
    student_id: 'usr-demo-001',
    type: 'credited',
    amount: 8,
    description: 'Verified disposal of Cardboard Box at Bin RB-07',
    status: 'completed',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    id: 'tx-005',
    student_id: 'usr-demo-001',
    type: 'credited',
    amount: 15,
    description: 'Verified disposal of Chemistry Glass Flask at Bin GB-05',
    status: 'completed',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString()
  }
];

export const MOCK_DISPOSALS: WasteDisposal[] = [
  {
    id: 'disp-001',
    student_id: 'usr-demo-001',
    bin_id: 'bin-001',
    waste_category: 'Recyclable',
    ai_confidence: 95.5,
    credits_awarded: 10,
    status: 'verified',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    verified_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    bin_label: 'RB-01',
    bin_location: 'Block A Ground Floor Entrance'
  },
  {
    id: 'disp-002',
    student_id: 'usr-demo-001',
    bin_id: 'bin-004',
    waste_category: 'E-Waste',
    ai_confidence: 92.0,
    credits_awarded: 25,
    status: 'verified',
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    verified_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    bin_label: 'EB-02',
    bin_location: 'Engineering Block 3'
  }
];
