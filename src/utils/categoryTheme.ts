export interface CategoryThemeInfo {
  id: string;
  name: string;
  icon: string;
  borderHex: string;
  borderClass: string;
  borderHoverHex: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentDot: string;
  ringClass: string;
  glowShadow: string;
  description: string;
}

export const CATEGORY_THEME_LIST: CategoryThemeInfo[] = [
  {
    id: 'housing',
    name: 'Housing',
    icon: '🏠',
    borderHex: '#10B981', // Emerald 500
    borderClass: 'border-emerald-500',
    borderHoverHex: '#059669',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    accentDot: 'bg-emerald-500',
    ringClass: 'ring-emerald-400/40',
    glowShadow: 'rgba(16, 185, 129, 0.22)',
    description: 'Apartments, rooms & rentals',
  },
  {
    id: 'jobs',
    name: 'Jobs',
    icon: '💼',
    borderHex: '#2563EB', // Blue 600
    borderClass: 'border-blue-500',
    borderHoverHex: '#1D4ED8',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-300',
    accentDot: 'bg-blue-500',
    ringClass: 'ring-blue-400/40',
    glowShadow: 'rgba(37, 99, 235, 0.22)',
    description: 'Employment, hiring & shifts',
  },
  {
    id: 'services',
    name: 'Services',
    icon: '🛠️',
    borderHex: '#F59E0B', // Amber 500
    borderClass: 'border-amber-500',
    borderHoverHex: '#D97706',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    accentDot: 'bg-amber-500',
    ringClass: 'ring-amber-400/40',
    glowShadow: 'rgba(245, 158, 11, 0.22)',
    description: 'Contractors, tutors & cleaning',
  },
  {
    id: 'for_sale',
    name: 'For Sale',
    icon: '🛍️',
    borderHex: '#EF4444', // Red 500
    borderClass: 'border-red-500',
    borderHoverHex: '#DC2626',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-800',
    badgeBorder: 'border-red-300',
    accentDot: 'bg-red-500',
    ringClass: 'ring-red-400/40',
    glowShadow: 'rgba(239, 68, 68, 0.22)',
    description: 'Vehicles, furniture & goods',
  },
  {
    id: 'community',
    name: 'Community',
    icon: '🤝',
    borderHex: '#0D9488', // Teal 600
    borderClass: 'border-teal-500',
    borderHoverHex: '#0F766E',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-300',
    accentDot: 'bg-teal-500',
    ringClass: 'ring-teal-400/40',
    glowShadow: 'rgba(13, 148, 136, 0.22)',
    description: 'Clubs, drives & rideshare',
  },
  {
    id: 'events',
    name: 'Events',
    icon: '🎉',
    borderHex: '#9333EA', // Purple 600
    borderClass: 'border-purple-500',
    borderHoverHex: '#7E22CE',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-300',
    accentDot: 'bg-purple-500',
    ringClass: 'ring-purple-400/40',
    glowShadow: 'rgba(147, 51, 234, 0.22)',
    description: 'Concerts & cultural gatherings',
  },
];

const DEFAULT_THEME: CategoryThemeInfo = {
  id: 'other',
  name: 'General',
  icon: '📌',
  borderHex: '#B45309', // Warm amber brown
  borderClass: 'border-amber-700',
  borderHoverHex: '#92400E',
  badgeBg: 'bg-amber-50',
  badgeText: 'text-amber-900',
  badgeBorder: 'border-amber-300',
  accentDot: 'bg-amber-600',
  ringClass: 'ring-amber-500/40',
  glowShadow: 'rgba(180, 83, 9, 0.2)',
  description: 'Community notices',
};

/**
 * Returns complete styling metadata for a given category name,
 * matching loosely to accommodate variations like 'Housing & Rentals' or 'Cultural Events'.
 */
export function getCategoryTheme(categoryName?: string | null): CategoryThemeInfo {
  if (!categoryName) return DEFAULT_THEME;
  const c = categoryName.toLowerCase().trim();

  if (c.includes('hous') || c.includes('rent') || c.includes('room') || c.includes('sublet')) {
    return CATEGORY_THEME_LIST.find((t) => t.id === 'housing')!;
  }
  if (c.includes('job') || c.includes('employ') || c.includes('work') || c.includes('hiring') || c.includes('shift')) {
    return CATEGORY_THEME_LIST.find((t) => t.id === 'jobs')!;
  }
  if (c.includes('serv') || c.includes('tutor') || c.includes('clean') || c.includes('repair') || c.includes('handyman') || c.includes('wash') || c.includes('alteration') || c.includes('catering') || c.includes('baking') || c.includes('plumb') || c.includes('tax')) {
    return CATEGORY_THEME_LIST.find((t) => t.id === 'services')!;
  }
  if (c.includes('sale') || c.includes('item') || c.includes('car') || c.includes('camry') || c.includes('toyota') || c.includes('civic') || c.includes('classified') || c.includes('laptop') || c.includes('phone') || c.includes('sofa') || c.includes('bike')) {
    return CATEGORY_THEME_LIST.find((t) => t.id === 'for_sale')!;
  }
  if (c.includes('commun') || c.includes('group') || c.includes('club') || c.includes('volunteer') || c.includes('choir') || c.includes('rideshare') || c.includes('soccer')) {
    return CATEGORY_THEME_LIST.find((t) => t.id === 'community')!;
  }
  if (c.includes('event') || c.includes('concert') || c.includes('festival') || c.includes('gather') || c.includes('party')) {
    return CATEGORY_THEME_LIST.find((t) => t.id === 'events')!;
  }

  // Exact match attempt
  const found = CATEGORY_THEME_LIST.find(
    (t) => t.name.toLowerCase() === c || t.id.toLowerCase() === c
  );
  return found || DEFAULT_THEME;
}
