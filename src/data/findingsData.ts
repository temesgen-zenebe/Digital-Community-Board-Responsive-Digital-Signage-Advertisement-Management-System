export interface CategoryMetric {
  id: string;
  name: string;
  percentage: number; // e.g. 28
  platformCount: number; // e.g. 1098
  storeCount: number; // e.g. 52 (at Salam Market)
  avgFee: number; // in USD
  color: string;
  hoverColor: string;
  description: string;
  topExamples: string[];
}

export interface StoreMetric {
  rank: number;
  id: string;
  name: string;
  city: string;
  state: string;
  revenue: number;
  orders: number;
  activeListings: number;
  avgOrderValue: number;
  growth: number;
  hardwareStatus: 'Online' | 'Warning' | 'Offline';
  screenUptime: string;
  joinedDate: string;
}

export interface DailyPoint {
  day: number;
  dateStr: string;
  weekday: string;
  platformRevenue: number;
  platformViews: number;
  platformUsers: number;
  platformOrders: number;
  storeRevenue: number;
  storeViews: number;
  storeUsers: number;
  isWeekend: boolean;
}

export interface FleetStatus {
  status: 'Active' | 'Pending Approval' | 'Paused' | 'Suspended';
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export interface ModerationItem {
  type: string;
  count: number;
  severity: 'normal' | 'attention' | 'urgent';
  actionLabel: string;
}

export type TileGridSize = '1x1' | '2x1' | '2x2' | '3x1';

export interface TVProfile {
  id: 'auto' | '55' | '65' | '75' | '85' | '98';
  label: string;
  diagonalInches: string;
  physicalDimensions: string;
  columns: number;
  rows: number;
  description: string;
  baseUnitPx: number; // Base unit pixel height for consistent row scaling
  isBaseline?: boolean;
}

export const TV_SCREEN_PROFILES: TVProfile[] = [
  { id: '75', label: '75" Commercial Display', diagonalInches: '75-inch', physicalDimensions: '65.4″ × 36.8″', columns: 7, rows: 3, description: 'Reference Baseline · 16:9 4K Commercial Display (65.4″ × 36.8″)', baseUnitPx: 240, isBaseline: true },
  { id: '65', label: '65" Grocery Wall TV', diagonalInches: '65-inch', physicalDimensions: '56.7″ × 31.9″', columns: 7, rows: 3, description: 'Scaled to fit · 16:9 4K Wall Display (56.7″ × 31.9″)', baseUnitPx: 220 },
  { id: '85', label: '85" Flagship Video Display', diagonalInches: '85-inch', physicalDimensions: '74.1″ × 41.7″', columns: 7, rows: 3, description: 'Scaled to fit · 16:9 4K Mega Video Display (74.1″ × 41.7″)', baseUnitPx: 260 },
  { id: 'auto', label: 'Auto-Fit Fluid', diagonalInches: 'Fluid 16:9', physicalDimensions: 'Responsive TV Fit', columns: 7, rows: 3, description: 'Dynamically scales to fit current viewport maintaining 16:9 landscape grid', baseUnitPx: 230 },
  { id: '55', label: '55" Aisle Display', diagonalInches: '55-inch', physicalDimensions: '47.9″ × 27.0″', columns: 7, rows: 3, description: 'Compact Display · 7×3 landscape grid', baseUnitPx: 200 },
  { id: '98', label: '98" Ultra Video Wall', diagonalInches: '98-inch', physicalDimensions: '85.4″ × 48.0″', columns: 7, rows: 3, description: 'Ultra-wide wall display · 7×3 landscape grid', baseUnitPx: 280 },
];

export interface ListingCardItem {
  id: string;
  title: string;
  category: string;
  details: string;
  priceOrRate: string;
  phone: string;
  pinColor: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  featured?: boolean;
  imageUrl?: string; // User-provided image
  imageAlt?: string;
  gridSize?: TileGridSize; // Screen-size independent relative grid units
}

// Logical placeholder image resolver: if user provided imageUrl, use it; otherwise provide a context-aware placeholder
export const getLogicalPlaceholderImage = (category: string, title: string): string => {
  const t = title.toLowerCase();
  const c = category.toLowerCase();

  if (t.includes('concert') || t.includes('music') || t.includes('guitar') || t.includes('piano')) {
    return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'; // Music instrument / stage
  }
  if (t.includes('apartment') || t.includes('2 bed')) {
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'; // Apartment building
  }
  if (t.includes('roommate') || t.includes('room for rent')) {
    return 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'; // Cozy bedroom / living space
  }
  if (t.includes('sofa') || t.includes('couch') || t.includes('furniture') || t.includes('bed')) {
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'; // Sofa living room
  }
  if (t.includes('dining table') || t.includes('chair')) {
    return 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80'; // Dining table
  }
  if (t.includes('math') || t.includes('tutor') || t.includes('english') || t.includes('language') || t.includes('amharic')) {
    return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'; // Books and study
  }
  if (t.includes('handyman') || t.includes('drywall') || t.includes('repair')) {
    return 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80'; // Tools & handyman
  }
  if (t.includes('bike') || t.includes('bicycle')) {
    return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80'; // Mountain bicycle
  }
  if (t.includes('car') || t.includes('camry') || t.includes('toyota') || t.includes('rideshare')) {
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80'; // Modern car
  }
  if (t.includes('cashier') || t.includes('cafe') || t.includes('barista') || t.includes('coffee')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80'; // Cafe cup & barista
  }
  if (t.includes('dog') || t.includes('pet') || t.includes('cat')) {
    return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'; // Golden dog
  }
  if (t.includes('hair') || t.includes('braid') || t.includes('salon')) {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80'; // Hair salon styling
  }
  if (t.includes('macbook') || t.includes('laptop') || t.includes('computer')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'; // Laptop computer
  }
  if (t.includes('soccer') || t.includes('sport') || t.includes('club')) {
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80'; // Soccer ball on grass
  }
  if (t.includes('babysitting') || t.includes('childcare') || t.includes('kids')) {
    return 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80'; // Wooden toy blocks
  }
  if (t.includes('phone') || t.includes('iphone') || t.includes('electronic') || t.includes('headphone')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'; // Smartphone
  }
  if (t.includes('cleaning') || t.includes('house clean')) {
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80'; // Cleaning supplies
  }
  if (t.includes('plant')) {
    return 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80'; // House plants
  }
  if (t.includes('wash') || t.includes('car wash')) {
    return 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=400&q=80'; // Car wash suds
  }
  if (t.includes('moving') || t.includes('boxes')) {
    return 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=400&q=80'; // Moving boxes
  }
  if (t.includes('baking') || t.includes('cake') || t.includes('cupcake')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80'; // Fresh cake / cupcakes
  }
  if (t.includes('health') || t.includes('medical') || t.includes('nurse')) {
    return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80'; // Healthcare stethoscope
  }
  if (t.includes('catering') || t.includes('injera') || t.includes('ethiopian food') || t.includes('food')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'; // Delicious prepared platter
  }
  if (t.includes('yard') || t.includes('lawn') || t.includes('grass')) {
    return 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=400&q=80'; // Fresh lawn yard
  }
  if (t.includes('sewing') || t.includes('alteration') || t.includes('tailor')) {
    return 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=400&q=80'; // Sewing fabrics & thread
  }
  if (t.includes('volunteer') || t.includes('food drive')) {
    return 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80'; // Volunteer hands
  }
  if (t.includes('art') || t.includes('craft') || t.includes('paint')) {
    return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80'; // Painting palette
  }

  // Generic category fallbacks
  switch (c) {
    case 'housing':
      return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80';
    case 'jobs':
      return 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80';
    case 'for sale':
      return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80';
    case 'services':
      return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80';
    case 'community':
      return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80';
    case 'events':
      return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80';
    default:
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80';
  }
};

export const getDisplayImage = (item: ListingCardItem): string => {
  if (item.imageUrl && item.imageUrl.trim().length > 0) {
    return item.imageUrl;
  }
  return getLogicalPlaceholderImage(item.category, item.title);
};

// 1. Category Distribution Findings (Donut chart & breakdown)
export const CATEGORY_FINDINGS: CategoryMetric[] = [
  {
    id: 'housing',
    name: 'Housing & Rentals',
    percentage: 28,
    platformCount: 1098,
    storeCount: 52,
    avgFee: 40.0,
    color: '#8B4513', // Deep Saddle Brown
    hoverColor: '#A0522D',
    description: 'Apartments, private rooms, roommate requests near university/work centers.',
    topExamples: ['2 bed/2 bath near UNLV ($1,450/mo)', 'Roommate Wanted ($700/mo)', 'Private room near Summerlin ($700/mo)'],
  },
  {
    id: 'jobs',
    name: 'Jobs & Employment',
    percentage: 22,
    platformCount: 862,
    storeCount: 41,
    avgFee: 35.0,
    color: '#C07D53', // Warm Terracotta
    hoverColor: '#D29068',
    description: 'Cashiers, restaurant staff, delivery drivers, retail and warehouse shifts.',
    topExamples: ['Cafe Cashier (Flexible hours)', 'Delivery Driver (Full-time)', 'Line Cook for Habesha Bistro'],
  },
  {
    id: 'for_sale',
    name: 'For Sale (Classifieds)',
    percentage: 18,
    platformCount: 706,
    storeCount: 33,
    avgFee: 20.0,
    color: '#D4A373', // Warm Tan
    hoverColor: '#DEB887',
    description: 'Vehicles, consumer electronics, furniture, household appliances, bicycles.',
    topExamples: ['Toyota Camry 2019 ($12,500)', 'MacBook Air M1 ($650)', '3-seat comfy sofa ($250)', 'Mountain bike ($180)'],
  },
  {
    id: 'services',
    name: 'Local Services',
    percentage: 15,
    platformCount: 588,
    storeCount: 28,
    avgFee: 60.0,
    color: '#E0C097', // Pale Amber
    hoverColor: '#EAD1B0',
    description: 'Handyman, mobile car wash, home cleaning, computer repair, tailoring, hair styling.',
    topExamples: ['Handyman Services (Free estimate)', 'House Cleaning (Weekly/Bi-weekly)', 'Mobile Car Wash ($30+)'],
  },
  {
    id: 'community',
    name: 'Community & Groups',
    percentage: 10,
    platformCount: 392,
    storeCount: 19,
    avgFee: 15.0,
    color: '#EED9C4', // Soft Parchment
    hoverColor: '#F5E6D6',
    description: 'Soccer clubs, volunteer food drives, rideshare coordination, language exchanges.',
    topExamples: ['Join Our Soccer Club (All ages)', 'Food Drive Community Help', 'Amharic Language Tutoring'],
  },
  {
    id: 'events',
    name: 'Cultural Events',
    percentage: 7,
    platformCount: 274,
    storeCount: 13,
    avgFee: 85.0,
    color: '#F4ECE1', // Warm Cream
    hoverColor: '#FAF4EC',
    description: 'Concerts, holiday celebrations, church/mosque gatherings, hall bookings.',
    topExamples: ['Upcoming Ethiopian Concert (Unity Center)', 'Community Fun Day (Oct 10)', 'Event Space for Rent'],
  },
];

// 2. Top Performing Stores (Merchant Leaderboard)
export const TOP_STORES_FINDINGS: StoreMetric[] = [
  {
    rank: 1,
    id: 'salam-lv',
    name: 'Salam Market',
    city: 'Las Vegas',
    state: 'NV',
    revenue: 8420,
    orders: 362,
    activeListings: 480,
    avgOrderValue: 23.26,
    growth: 24.5,
    hardwareStatus: 'Online',
    screenUptime: '99.9%',
    joinedDate: 'Jan 2026',
  },
  {
    rank: 2,
    id: 'habesha-market',
    name: 'Habesha Market',
    city: 'Los Angeles',
    state: 'CA',
    revenue: 6950,
    orders: 298,
    activeListings: 420,
    avgOrderValue: 23.32,
    growth: 21.0,
    hardwareStatus: 'Online',
    screenUptime: '99.8%',
    joinedDate: 'Feb 2026',
  },
  {
    rank: 3,
    id: 'selam-grocery',
    name: 'Selam Grocery',
    city: 'Seattle',
    state: 'WA',
    revenue: 5870,
    orders: 256,
    activeListings: 310,
    avgOrderValue: 22.93,
    growth: 18.2,
    hardwareStatus: 'Online',
    screenUptime: '99.7%',
    joinedDate: 'Mar 2026',
  },
  {
    rank: 4,
    id: 'nile-market',
    name: 'Nile Market',
    city: 'Dallas',
    state: 'TX',
    revenue: 4980,
    orders: 210,
    activeListings: 260,
    avgOrderValue: 23.71,
    growth: 19.4,
    hardwareStatus: 'Online',
    screenUptime: '99.9%',
    joinedDate: 'Apr 2026',
  },
  {
    rank: 5,
    id: 'ethio-fresh',
    name: 'Ethio Fresh',
    city: 'Atlanta',
    state: 'GA',
    revenue: 4120,
    orders: 176,
    activeListings: 240,
    avgOrderValue: 23.41,
    growth: 15.8,
    hardwareStatus: 'Online',
    screenUptime: '99.6%',
    joinedDate: 'May 2026',
  },
  {
    rank: 6,
    id: 'other-stores',
    name: 'Other 181 Partner Stores',
    city: 'Nationwide',
    state: 'US',
    revenue: 17980,
    orders: 882,
    activeListings: 2210,
    avgOrderValue: 20.38,
    growth: 23.0,
    hardwareStatus: 'Online',
    screenUptime: '99.4%',
    joinedDate: '2026',
  },
];

// 3. Store Fleet Status (186 stores total)
export const FLEET_STATUS_FINDINGS: FleetStatus[] = [
  {
    status: 'Active',
    count: 142,
    percentage: 76.3,
    color: '#2E7D32', // Green
    description: 'Hardware displays streaming in-store with active client bookings.',
  },
  {
    status: 'Pending Approval',
    count: 18,
    percentage: 9.7,
    color: '#D97706', // Amber
    description: 'New grocery locations onboarded awaiting display installation & verification.',
  },
  {
    status: 'Paused',
    count: 14,
    percentage: 7.5,
    color: '#B45309', // Deep amber/brown
    description: 'Store renovations or temporary merchant hiatus.',
  },
  {
    status: 'Suspended',
    count: 12,
    percentage: 6.5,
    color: '#6B7280', // Slate gray
    description: 'Terminated agreements or offline network issues beyond 72h.',
  },
];

// 4. Moderation & Operations Metrics
export const MODERATION_FINDINGS: ModerationItem[] = [
  { type: 'Pending Listings', count: 24, severity: 'attention', actionLabel: 'Review ad submissions' },
  { type: 'Pending Store Approvals', count: 8, severity: 'attention', actionLabel: 'Review onboarding' },
  { type: 'Reported Content', count: 5, severity: 'urgent', actionLabel: 'Resolve community flags' },
  { type: 'User Inquiries / Reports', count: 3, severity: 'normal', actionLabel: 'Respond to tickets' },
];

// 5. 31-Day Time Series Data (Oct 1 - Oct 31, 2026)
// Corresponds precisely with the graphs depicted in the document & dashboards
export const generateDailyTrendData = (): DailyPoint[] => {
  const points: DailyPoint[] = [
    { day: 1, dateStr: 'Oct 1', weekday: 'Thu', platformRevenue: 1120, platformViews: 14800, platformUsers: 540, platformOrders: 48, storeRevenue: 28, storeViews: 480, storeUsers: 52, isWeekend: false },
    { day: 2, dateStr: 'Oct 2', weekday: 'Fri', platformRevenue: 1340, platformViews: 16500, platformUsers: 620, platformOrders: 56, storeRevenue: 35, storeViews: 540, storeUsers: 64, isWeekend: false },
    { day: 3, dateStr: 'Oct 3', weekday: 'Sat', platformRevenue: 1980, platformViews: 22100, platformUsers: 790, platformOrders: 82, storeRevenue: 64, storeViews: 780, storeUsers: 88, isWeekend: true },
    { day: 4, dateStr: 'Oct 4', weekday: 'Sun', platformRevenue: 2350, platformViews: 25400, platformUsers: 860, platformOrders: 94, storeRevenue: 72, storeViews: 860, storeUsers: 95, isWeekend: true },
    { day: 5, dateStr: 'Oct 5', weekday: 'Mon', platformRevenue: 1210, platformViews: 18200, platformUsers: 510, platformOrders: 52, storeRevenue: 30, storeViews: 620, storeUsers: 58, isWeekend: false },
    { day: 6, dateStr: 'Oct 6', weekday: 'Tue', platformRevenue: 1150, platformViews: 19400, platformUsers: 530, platformOrders: 50, storeRevenue: 25, storeViews: 650, storeUsers: 56, isWeekend: false },
    { day: 7, dateStr: 'Oct 7', weekday: 'Wed', platformRevenue: 1280, platformViews: 21300, platformUsers: 580, platformOrders: 55, storeRevenue: 32, storeViews: 710, storeUsers: 60, isWeekend: false },
    { day: 8, dateStr: 'Oct 8', weekday: 'Thu', platformRevenue: 1420, platformViews: 23600, platformUsers: 640, platformOrders: 62, storeRevenue: 38, storeViews: 790, storeUsers: 68, isWeekend: false },
    { day: 9, dateStr: 'Oct 9', weekday: 'Fri', platformRevenue: 1750, platformViews: 26800, platformUsers: 720, platformOrders: 74, storeRevenue: 48, storeViews: 920, storeUsers: 78, isWeekend: false },
    { day: 10, dateStr: 'Oct 10', weekday: 'Sat', platformRevenue: 2840, platformViews: 32400, platformUsers: 980, platformOrders: 118, storeRevenue: 85, storeViews: 1140, storeUsers: 112, isWeekend: true },
    { day: 11, dateStr: 'Oct 11', weekday: 'Sun', platformRevenue: 2920, platformViews: 34100, platformUsers: 1010, platformOrders: 124, storeRevenue: 88, storeViews: 1190, storeUsers: 118, isWeekend: true },
    { day: 12, dateStr: 'Oct 12', weekday: 'Mon', platformRevenue: 1390, platformViews: 24500, platformUsers: 610, platformOrders: 58, storeRevenue: 34, storeViews: 810, storeUsers: 66, isWeekend: false },
    { day: 13, dateStr: 'Oct 13', weekday: 'Tue', platformRevenue: 1450, platformViews: 25200, platformUsers: 630, platformOrders: 60, storeRevenue: 36, storeViews: 840, storeUsers: 69, isWeekend: false },
    { day: 14, dateStr: 'Oct 14', weekday: 'Wed', platformRevenue: 1510, platformViews: 26800, platformUsers: 660, platformOrders: 64, storeRevenue: 40, storeViews: 890, storeUsers: 74, isWeekend: false },
    { day: 15, dateStr: 'Oct 15', weekday: 'Thu', platformRevenue: 1680, platformViews: 28900, platformUsers: 710, platformOrders: 70, storeRevenue: 46, storeViews: 960, storeUsers: 81, isWeekend: false },
    { day: 16, dateStr: 'Oct 16', weekday: 'Fri', platformRevenue: 1940, platformViews: 31200, platformUsers: 780, platformOrders: 82, storeRevenue: 54, storeViews: 1050, storeUsers: 89, isWeekend: false },
    { day: 17, dateStr: 'Oct 17', weekday: 'Sat', platformRevenue: 3150, platformViews: 38200, platformUsers: 1120, platformOrders: 132, storeRevenue: 96, storeViews: 1320, storeUsers: 125, isWeekend: true },
    { day: 18, dateStr: 'Oct 18', weekday: 'Sun', platformRevenue: 3320, platformViews: 39900, platformUsers: 1180, platformOrders: 141, storeRevenue: 102, storeViews: 1380, storeUsers: 134, isWeekend: true },
    { day: 19, dateStr: 'Oct 19', weekday: 'Mon', platformRevenue: 1560, platformViews: 28400, platformUsers: 670, platformOrders: 66, storeRevenue: 42, storeViews: 940, storeUsers: 76, isWeekend: false },
    { day: 20, dateStr: 'Oct 20', weekday: 'Tue', platformRevenue: 1620, platformViews: 29600, platformUsers: 690, platformOrders: 68, storeRevenue: 44, storeViews: 990, storeUsers: 78, isWeekend: false },
    { day: 21, dateStr: 'Oct 21', weekday: 'Wed', platformRevenue: 1710, platformViews: 31500, platformUsers: 730, platformOrders: 72, storeRevenue: 48, storeViews: 1040, storeUsers: 83, isWeekend: false },
    { day: 22, dateStr: 'Oct 22', weekday: 'Thu', platformRevenue: 1890, platformViews: 33800, platformUsers: 790, platformOrders: 80, storeRevenue: 52, storeViews: 1120, storeUsers: 90, isWeekend: false },
    { day: 23, dateStr: 'Oct 23', weekday: 'Fri', platformRevenue: 2240, platformViews: 37200, platformUsers: 880, platformOrders: 95, storeRevenue: 68, storeViews: 1240, storeUsers: 102, isWeekend: false },
    { day: 24, dateStr: 'Oct 24', weekday: 'Sat', platformRevenue: 3940, platformViews: 45600, platformUsers: 1350, platformOrders: 165, storeRevenue: 124, storeViews: 1560, storeUsers: 148, isWeekend: true },
    { day: 25, dateStr: 'Oct 25', weekday: 'Sun', platformRevenue: 4120, platformViews: 47800, platformUsers: 1410, platformOrders: 172, storeRevenue: 132, storeViews: 1620, storeUsers: 155, isWeekend: true },
    { day: 26, dateStr: 'Oct 26', weekday: 'Mon', platformRevenue: 1840, platformViews: 34200, platformUsers: 780, platformOrders: 78, storeRevenue: 58, storeViews: 1180, storeUsers: 88, isWeekend: false },
    { day: 27, dateStr: 'Oct 27', weekday: 'Tue', platformRevenue: 1910, platformViews: 35800, platformUsers: 820, platformOrders: 82, storeRevenue: 62, storeViews: 1220, storeUsers: 92, isWeekend: false },
    { day: 28, dateStr: 'Oct 28', weekday: 'Wed', platformRevenue: 2050, platformViews: 38200, platformUsers: 870, platformOrders: 88, storeRevenue: 68, storeViews: 1310, storeUsers: 98, isWeekend: false },
    { day: 29, dateStr: 'Oct 29', weekday: 'Thu', platformRevenue: 2480, platformViews: 42100, platformUsers: 960, platformOrders: 104, storeRevenue: 82, storeViews: 1450, storeUsers: 110, isWeekend: false },
    { day: 30, dateStr: 'Oct 30', weekday: 'Fri', platformRevenue: 3850, platformViews: 52400, platformUsers: 1290, platformOrders: 160, storeRevenue: 148, storeViews: 1820, storeUsers: 142, isWeekend: false },
    { day: 31, dateStr: 'Oct 31', weekday: 'Sat', platformRevenue: 4890, platformViews: 58900, platformUsers: 1580, platformOrders: 198, storeRevenue: 186, storeViews: 2050, storeUsers: 164, isWeekend: true },
  ];
  return points;
};

// 6. Realistic sample of pinned items for Corkboard Display preview
// Stored as relative grid units (1x1, 2x1, 3x1) for screen-size independence across 55"-98" TVs
export const SAMPLE_CORKBOARD_LISTINGS: ListingCardItem[] = [
  // --- Batch 1 ---
  { id: '1', title: 'Apartment for Rent', category: 'Housing', details: '2 bed / 2 bath · Spacious & clean near UNLV', priceOrRate: '$1,450/month', phone: '702-555-0129', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80', gridSize: '2x1' },
  { id: '2', title: 'Roommate Wanted', category: 'Housing', details: 'Clean, responsible roommate near UNLV campus', priceOrRate: '$700/month', phone: '702-555-0143', pinColor: 'yellow', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '3', title: 'Sofa for Sale', category: 'For Sale', details: 'Like new, comfy 3-seat living room sofa', priceOrRate: '$250 (OBO)', phone: '702-555-0124', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '4', title: 'Math Tutoring', category: 'Services', details: 'Grades K–12 · In person or online · First free', priceOrRate: 'Flexible rates', phone: '702-555-0109', pinColor: 'green', gridSize: '1x1' },
  { id: '5', title: 'Handyman Services', category: 'Services', details: 'Painting · Drywall · Furniture assembly · Free estimate', priceOrRate: 'Free estimate!', phone: '702-555-0168', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80', gridSize: '2x1' },
  { id: '6', title: 'Mountain Bicycle', category: 'For Sale', details: 'Mountain bike in excellent tuned condition', priceOrRate: '$180', phone: '702-555-0133', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '7', title: 'Toyota Camry 2019', category: 'For Sale', details: 'Great mechanical condition, clean title, low miles, garage kept', priceOrRate: '$12,500 (OBO)', phone: '702-555-0198', pinColor: 'purple', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80', gridSize: '3x1' },
  { id: '8', title: 'Cafe Cashier', category: 'Jobs', details: 'Flexible morning & afternoon hours · Friendly team', priceOrRate: 'Great team!', phone: '702-555-0175', pinColor: 'yellow', gridSize: '1x1' },
  { id: '9', title: 'Dog Sitting', category: 'Services', details: 'Loving & reliable pet caregiver, weekends & evenings', priceOrRate: 'Weekends & eves', phone: '702-555-0011', pinColor: 'green', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '10', title: 'Hair Styling', category: 'Services', details: 'Color · Cut · Highlights · Special promo', priceOrRate: 'Special $60', phone: '702-555-0185', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '11', title: 'Laptop for Sale', category: 'For Sale', details: 'MacBook Air M1 · 8GB RAM 256GB · Excellent', priceOrRate: 'Excellent condition', phone: '702-555-0146', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '12', title: 'Join Our Soccer Club', category: 'Community', details: 'All ages welcome! Practice every Saturday', priceOrRate: 'Practice Saturdays', phone: '702-555-0196', pinColor: 'green', gridSize: '1x1' },
  { id: '13', title: 'Babysitting', category: 'Services', details: 'Experienced & caring · CPR certified caregiver', priceOrRate: 'Weekends available', phone: '702-555-0150', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '14', title: 'Room for Rent', category: 'Housing', details: 'Private room, shared bath Near Summerlin', priceOrRate: '$700/month', phone: '702-555-0117', pinColor: 'yellow', gridSize: '1x1' },
  { id: '15', title: 'iPhone 14 for Sale', category: 'For Sale', details: '128GB, unlocked, great condition', priceOrRate: '$320', phone: '702-555-0161', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '16', title: 'House Cleaning', category: 'Services', details: 'Reliable & affordable · Weekly / Bi-weekly', priceOrRate: 'Weekly / Bi-weekly', phone: '702-555-0171', pinColor: 'green', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '17', title: 'Plants for Sale', category: 'For Sale', details: 'Indoor & outdoor plants · Great prices', priceOrRate: 'Great prices', phone: '702-555-0131', pinColor: 'green', imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '18', title: 'Dining Table Set', category: 'For Sale', details: '6-chair set, solid wood, good condition for large dining rooms', priceOrRate: '$300 (OBO)', phone: '702-555-0138', pinColor: 'yellow', imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80', gridSize: '2x1' },
  { id: '19', title: 'Tutor – English', category: 'Services', details: 'All ages welcome · Improve reading & writing', priceOrRate: 'All ages welcome', phone: '702-555-0201', pinColor: 'red', gridSize: '1x1' },
  { id: '20', title: 'Mobile Car Wash', category: 'Services', details: 'We come to your home or work! Complete interior & exterior detail', priceOrRate: 'Starting at $30', phone: '702-555-0169', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=400&q=80', gridSize: '2x1' },

  // --- Batch 2 ---
  { id: '21', title: 'Guitar Lessons', category: 'Services', details: 'All ages · Beginner to advanced acoustic/electric', priceOrRate: 'Custom sessions', phone: '702-555-0188', pinColor: 'yellow', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '22', title: 'Pet Supplies for Sale', category: 'For Sale', details: 'New & gently used leashes, crates, more', priceOrRate: 'Affordable', phone: '702-555-0119', pinColor: 'green', gridSize: '1x1' },
  { id: '23', title: 'Moving Help', category: 'Services', details: 'Quick & reliable movers · Dolly & truck ready', priceOrRate: '$40/hour (2 hr min)', phone: '702-555-0122', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '24', title: 'Baking Orders', category: 'Services', details: 'Custom cakes & treats · Birthdays · Events', priceOrRate: 'Special events', phone: '702-555-0148', pinColor: 'yellow', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '25', title: 'Healthcare Support', category: 'Services', details: 'Companion care · Errands · Appointments', priceOrRate: 'Compassionate', phone: '702-555-0194', pinColor: 'red', gridSize: '1x1' },
  { id: '26', title: 'Ethiopian Food Catering', category: 'Services', details: 'Fresh Injera · Doro Wat · Veggie combos · Complete custom catering for celebrations', priceOrRate: 'Custom catering', phone: '702-555-0127', pinColor: 'green', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', featured: true, gridSize: '2x1' },
  { id: '27', title: 'Computer Repair', category: 'Services', details: 'Virus removal · Upgrades · Affordable rates', priceOrRate: 'Free diagnostics', phone: '702-555-0158', pinColor: 'blue', gridSize: '1x1' },
  { id: '28', title: 'Yard Work', category: 'Services', details: 'Lawn mowing · Trimming · Clean up · Free estimate', priceOrRate: 'Free estimate', phone: '702-555-0186', pinColor: 'green', imageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '29', title: 'Event Space for Rent', category: 'Events', details: 'Perfect for birthdays, church gatherings, business meetings & family banquets', priceOrRate: 'Hourly rates', phone: '702-555-0140', pinColor: 'purple', gridSize: '2x1' },
  { id: '30', title: 'Sewing & Alterations', category: 'Services', details: 'Clothing repair & custom traditional habesha work', priceOrRate: 'Custom work', phone: '702-555-0207', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '31', title: 'Language Tutoring', category: 'Services', details: 'Amharic · English · All levels welcome', priceOrRate: 'All levels', phone: '702-555-0164', pinColor: 'yellow', gridSize: '1x1' },
  { id: '32', title: 'Rideshare / Carpool', category: 'Community', details: 'To UNLV / Work / Airport · Flexible schedule', priceOrRate: 'Flexible schedule', phone: '702-555-0121', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '33', title: 'Home Childcare', category: 'Services', details: 'Safe & loving environment · Nutritious meals provided', priceOrRate: 'Meals provided', phone: '702-555-0178', pinColor: 'green', gridSize: '1x1' },
  { id: '34', title: 'Electronics for Sale', category: 'For Sale', details: 'Wireless noise-cancelling headphones · Like new', priceOrRate: 'Like new – $75', phone: '702-555-0190', pinColor: 'purple', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '35', title: 'Volunteer Opportunity', category: 'Community', details: 'Food drive · Community help · Make a difference!', priceOrRate: 'Community drive', phone: '702-555-0194', pinColor: 'green', imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '36', title: 'Furniture for Sale', category: 'For Sale', details: 'Queen bed frame with headboard in good condition', priceOrRate: '$150', phone: '702-555-0162', pinColor: 'yellow', gridSize: '1x1' },
  { id: '37', title: 'Music Lessons', category: 'Services', details: 'Piano · Keyboard · Music Theory · All ages', priceOrRate: 'All ages welcome', phone: '702-555-0156', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1520523839898-507127053e14?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '38', title: 'Art & Crafts Sale', category: 'For Sale', details: 'Handmade items supporting local artisans', priceOrRate: 'Local artists', phone: '702-555-0165', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '39', title: 'Cleaning Supplies', category: 'For Sale', details: 'Bulk commercial cleaning supplies · Great prices', priceOrRate: 'Bulk discount', phone: '702-555-0128', pinColor: 'blue', gridSize: '1x1' },
  { id: '40', title: 'Roommate for Female', category: 'Housing', details: 'Furnished room Near UNLV · Quiet environment', priceOrRate: '$650/month', phone: '702-555-0135', pinColor: 'yellow', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },

  // --- Batch 3 ---
  { id: '41', title: 'Community Fun Day', category: 'Events', details: 'Sat, Oct 10 · Food · Music · Activities · Free', priceOrRate: 'Free admission', phone: '702-555-0170', pinColor: 'purple', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80', gridSize: '2x1' },
  { id: '42', title: 'Habesha Dress & Kemis', category: 'For Sale', details: 'Authentic handmade Ethiopian dress, unworn size M', priceOrRate: '$120 (Firm)', phone: '702-555-0211', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '43', title: 'Warehouse Associate', category: 'Jobs', details: 'Morning shift 6am–2pm · Forklift experience plus', priceOrRate: '$21.50/hr', phone: '702-555-0219', pinColor: 'yellow', gridSize: '1x1' },
  { id: '44', title: 'Coffee Ceremony Set (Jebena)', category: 'For Sale', details: 'Clay pot Jebena with 6 cups, censer & serving tray', priceOrRate: '$65', phone: '702-555-0222', pinColor: 'blue', imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '45', title: 'Tax & Bookkeeping Help', category: 'Services', details: 'Personal & small business returns · Habesha owned', priceOrRate: 'Free initial call', phone: '702-555-0230', pinColor: 'green', gridSize: '1x1' },
  { id: '46', title: 'Studio Apartment Sublet', category: 'Housing', details: 'Furnished studio · Utilities included · Nov–Jan', priceOrRate: '$1,100/mo', phone: '702-555-0235', pinColor: 'red', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80', gridSize: '2x1' },
  { id: '47', title: 'Plumbing & Drain Snaking', category: 'Services', details: 'Emergency leaks, faucets, toilet fixes', priceOrRate: 'Fast response', phone: '702-555-0244', pinColor: 'blue', gridSize: '1x1' },
  { id: '48', title: 'Ethiopian Orthodox Choir', category: 'Community', details: 'Weekly practice on Thursdays · Welcoming new voices', priceOrRate: 'Volunteers', phone: '702-555-0250', pinColor: 'green', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', gridSize: '1x1' },
  { id: '49', title: 'Honda Civic 2017', category: 'For Sale', details: 'Well maintained, 78k miles, runs perfectly', priceOrRate: '$10,800', phone: '702-555-0255', pinColor: 'purple', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80', gridSize: '3x1' },
  { id: '50', title: 'Catering Prep Cook', category: 'Jobs', details: 'Weekend catering kitchen · Experienced with traditional foods', priceOrRate: '$20/hr', phone: '702-555-0260', pinColor: 'yellow', gridSize: '1x1' },
];

// Re-export dynamic CSS Grid percentage scaling engine
export {
  calculateTileGridPercentages,
  parseTileUnits,
  getTVProfileColumnCount,
  STANDARD_RELATIVE_TILES,
  type DynamicTileScaleResult,
  type TileScaleOptions,
} from '../utils/gridScale';

