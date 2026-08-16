// Business Rules & Constants for EcoCredit System

export const DAILY_REWARDED_CAP = 3;

export const WASTE_CREDIT_VALUES: Record<string, { credits: number; label: string; color: string; description: string }> = {
  'Plastic': {
    credits: 10,
    label: 'Plastic Bottle / Packaging',
    color: '#D4AF37',
    description: 'Clean plastic containers, bottles, PET packaging'
  },
  'Recyclable': {
    credits: 10,
    label: 'Recyclable Plastic / Packaging',
    color: '#D4AF37',
    description: 'Clean plastic containers, bottles, PET packaging'
  },
  'Paper': {
    credits: 8,
    label: 'Paper & Cardboard',
    color: '#E6C65C',
    description: 'Books, notebooks, paper sheets, cardboard boxes'
  },
  'E-Waste': {
    credits: 25,
    label: 'Electronic Waste',
    color: '#34D399',
    description: 'Batteries, wires, circuit boards, small appliances'
  },
  'Glass': {
    credits: 15,
    label: 'Glass Bottles & Containers',
    color: '#60A5FA',
    description: 'Intact glass bottles, jars, glass lab apparatus'
  },
  'Organic': {
    credits: 5,
    label: 'Organic / Biodegradable',
    color: '#A3E635',
    description: 'Food scraps, fruit peels, compostable lunch boxes'
  },
  'Hazardous': {
    credits: 0,
    label: 'Hazardous Waste',
    color: '#F87171',
    description: 'Chemical containers, medical waste, sharp objects'
  },
  'Non-Recyclable': {
    credits: 2,
    label: 'General / Non-Recyclable',
    color: '#9CA3AF',
    description: 'Stained wrappers, multi-layer foil, general trash'
  }
};

export const CAMPUS_CENTER = {
  latitude: 12.9716,
  longitude: 77.5946,
  name: 'Central University Quadrangle'
};

export const CAMPUS_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil & Environmental Science',
  'Biotechnology & Eco-Tech',
  'Business Administration (MBA)',
  'Physics & Material Sciences',
  'Humanities & Social Sciences'
];
