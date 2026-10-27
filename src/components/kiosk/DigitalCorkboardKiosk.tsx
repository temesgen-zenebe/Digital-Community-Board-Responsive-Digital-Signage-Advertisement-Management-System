import React, { useState, useEffect, useRef } from 'react';
import {
  SAMPLE_CORKBOARD_LISTINGS,
  getDisplayImage,
  getLogicalPlaceholderImage,
  TV_SCREEN_PROFILES,
  calculateTileGridPercentages,
  STANDARD_RELATIVE_TILES,
  type ListingCardItem,
  type TileGridSize,
  type TVProfile,
} from '../../data/findingsData';
import { PinDetailModal } from './PinDetailModal';
import { RegisterScreenModal } from './RegisterScreenModal';
import { StoreSpecialsModal } from './StoreSpecialsModal';
import { QRCodeCanvas } from '../common/QRCodeCanvas';
import {
  Sun,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Calendar,
  MapPin,
  Filter,
  Sparkles,
  X,
  Store,
  Settings,
  ChevronDown,
  CheckCircle2,
  Scale,
  Monitor,
  Home,
  Wifi,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Tag,
  Briefcase,
  Wrench,
  Users,
  Heart,
  Laptop,
  Flame,
} from 'lucide-react';

export interface BoardDisplayConfig {
  storeName: string;
  storeAddress: string;
  boardId: string;
  status?: string;
  screenType?: string;
}

export interface DigitalCorkboardKioskProps {
  onExitFullscreen?: () => void;
  isEmbedded?: boolean;
  boardConfig?: BoardDisplayConfig;
  initialSlideInterval?: number;
  onOpenStoreDashboard?: () => void;
  onOpenManageList?: (boardId: string) => void;
  allListings?: ListingCardItem[];
}

// Category icon helper matching master design reference
const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase().trim();
  if (cat.includes('housing') || cat.includes('rent') || cat.includes('apartment')) {
    return <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
  }
  if (cat.includes('job') || cat.includes('work') || cat.includes('hiring')) {
    return <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
  }
  if (cat.includes('service') || cat.includes('tutor') || cat.includes('clean') || cat.includes('repair')) {
    return <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
  }
  if (cat.includes('community') || cat.includes('group')) {
    return <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
  }
  if (cat.includes('pet') || cat.includes('dog') || cat.includes('cat')) {
    return <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
  }
  if (cat.includes('electronic') || cat.includes('phone') || cat.includes('laptop')) {
    return <Laptop className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
  }
  if (cat.includes('event') || cat.includes('concert') || cat.includes('festival')) {
    return <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
  }
  return <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />;
};

// 1. Large Featured 2×2 Advertisement Items (Upper-Left Region)
export const FEATURED_2X2_POOL: ListingCardItem[] = [
  {
    id: 'cultural-catering-featured',
    title: 'Ethiopian Food Catering & Banquet – Habesha Cultural Feasts',
    category: 'Services',
    details: 'Full traditional Ethiopian catering for weddings, family celebrations, holidays & community events. Fresh injera, spicy doro wat, kitfo, tibs & hearty vegan combos.',
    priceOrRate: 'Custom Catering Packages',
    phone: '702-555-0127',
    pinColor: 'green',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
    gridSize: '2x2',
  },
  {
    id: 'community-funday-featured',
    title: 'Annual Community Fun Day – Unity Center Cultural Festival',
    category: 'Events',
    details: 'Celebrate with us! Free admission for all families. Ethiopian traditional games, live acoustic krar, children activities, coffee ceremonies & artisan bazaar.',
    priceOrRate: 'Free Family Admission',
    phone: '702-555-0170',
    pinColor: 'purple',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80',
    gridSize: '2x2',
  },
  {
    id: 'event-hall-featured',
    title: 'Grand Event Space & Banquet Hall for Rent – All Occasions',
    category: 'Events',
    details: 'Spacious banquet hall accommodating up to 250 guests. State-of-the-art sound system, ambient lighting, private dressing suites & kitchen access.',
    priceOrRate: 'Flexible Hourly & Daily Rates',
    phone: '702-555-0140',
    pinColor: 'yellow',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80',
    gridSize: '2x2',
  },
];

// 2. Wide 2×1 Advertisements Pool (Positioned toward center-left: cols 3-4, row 2)
export const WIDE_2X1_POOL: ListingCardItem[] = [
  {
    id: 'apt-unlv-2x1',
    title: 'Spacious 2 Bed / 2 Bath Apartment near UNLV & Strip',
    category: 'Housing',
    details: 'Gated community, swimming pool, in-unit washer/dryer, updated quartz counters. Minutes to university, airport & market.',
    priceOrRate: '$1,450/month',
    phone: '702-555-0129',
    pinColor: 'red',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    gridSize: '2x1',
  },
  {
    id: 'handyman-2x1',
    title: 'Professional Handyman Services – Interior & Exterior Repairs',
    category: 'Services',
    details: 'Drywall patching, painting, plumbing repairs, light fixtures, electrical switches & furniture assembly. Free on-site estimates.',
    priceOrRate: 'Free Estimate!',
    phone: '702-555-0168',
    pinColor: 'blue',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
    gridSize: '2x1',
  },
  {
    id: 'dining-set-2x1',
    title: 'Solid Hardwood Dining Table Set with 6 Upholstered Chairs',
    category: 'For Sale',
    details: 'Gently used solid mahogany dining set in pristine condition. Extendable leaf included. Perfect for family holiday dinners.',
    priceOrRate: '$300 (OBO)',
    phone: '702-555-0138',
    pinColor: 'yellow',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
    gridSize: '2x1',
  },
  {
    id: 'mobile-carwash-2x1',
    title: 'Eco Mobile Auto Detailing – Home & Work Fleet Visits',
    category: 'Services',
    details: 'Hand wash, clay bar, ceramic sealant, steam interior vacuum & leather rejuvenation. We come to your driveway!',
    priceOrRate: 'Starting at $30',
    phone: '702-555-0169',
    pinColor: 'green',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80',
    gridSize: '2x1',
  },
];

// 3. Wide 3×1 Advertisements Pool (Positioned toward center-right: cols 5-7, row 2)
export const WIDE_3X1_POOL: ListingCardItem[] = [
  {
    id: 'camry-3x1',
    title: 'Toyota Camry LE 2019 – Low Miles, Clean Title, Garage Kept',
    category: 'For Sale',
    details: 'Single owner, pristine maintenance history at dealership, 48k original highway miles, backup camera, blind-spot monitor & cold A/C.',
    priceOrRate: '$12,500 (OBO)',
    phone: '702-555-0198',
    pinColor: 'purple',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80',
    gridSize: '3x1',
  },
  {
    id: 'salam-special-3x1',
    title: 'Salam Market Daily Specials – Fresh Halal Meats & Ethiopian Injera',
    category: 'Store Special',
    details: 'Daily fresh butchered goat, beef, lamb & chicken. Warm teff injera baked morning and afternoon. Spices, berbere & clarified butter.',
    priceOrRate: 'Daily Fresh Specials',
    phone: '702-555-0100',
    pinColor: 'yellow',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
    gridSize: '3x1',
  },
  {
    id: 'civic-3x1',
    title: 'Honda Civic EX 2017 – Excellent Condition, Sunroof & Apple CarPlay',
    category: 'For Sale',
    details: 'Super reliable daily driver, 78k miles, runs smoothly, brand new Michelin tires, recently inspected and smog certified.',
    priceOrRate: '$10,800',
    phone: '702-555-0255',
    pinColor: 'blue',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80',
    gridSize: '3x1',
  },
  {
    id: 'concert-spotlight-3x1',
    title: 'Ethiopian Cultural Concert Tickets & VIP Table Reservations',
    category: 'Events',
    details: 'Join the grand diaspora music night! Live singers, authentic Habesha orchestra, dinner banquet and cultural dancing.',
    priceOrRate: 'Tickets $25 at Door',
    phone: '702-555-0100',
    pinColor: 'red',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80',
    gridSize: '3x1',
  },
];

// Combined pool of all available board listings for QR scanning lookup
export const ALL_BOARD_LISTINGS: ListingCardItem[] = [
  ...SAMPLE_CORKBOARD_LISTINGS,
  ...FEATURED_2X2_POOL,
  ...WIDE_2X1_POOL,
  ...WIDE_3X1_POOL,
];

export const DigitalCorkboardKiosk: React.FC<DigitalCorkboardKioskProps> = ({
  onExitFullscreen,
  isEmbedded = false,
  boardConfig: propBoardConfig,
  initialSlideInterval = 10,
  onOpenStoreDashboard,
  onOpenManageList,
  allListings,
}) => {
  // Navigation dropdown states: 'none' | 'market' | 'display' | 'filters' | 'settings'
  type DropdownType = 'none' | 'market' | 'display' | 'filters' | 'settings';
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>('none');
  const navBarRef = useRef<HTMLDivElement>(null);

  // TV Screen Size Profile: 75" (Reference Baseline), 65", 85", or Auto
  const [selectedTvProfileId, setSelectedTvProfileId] = useState<'auto' | '55' | '65' | '75' | '85' | '98'>('75');

  // Slide time in seconds (configurable: 5, 10, 15, 20, 30)
  const [slideInterval, setSlideInterval] = useState<number>(initialSlideInterval);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0); // 0 to 100%

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<ListingCardItem | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isSpecialsModalOpen, setIsSpecialsModalOpen] = useState<boolean>(false);
  const [revealedPhoneId, setRevealedPhoneId] = useState<string | null>(null);
  const [copiedBoardId, setCopiedBoardId] = useState<boolean>(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1920);
  const [calculatorTileSize, setCalculatorTileSize] = useState<TileGridSize>('2x2');

  // Real-time clock & synchronization timestamp
  const [currentTime, setCurrentTime] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Measure container width for fluid scaling calculations
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || window.innerWidth || 1920);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Check URL parameters for direct QR scan redirection (e.g. ?pin=12 or ?register=SM-LV-001)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkUrlParams = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        let pinId = searchParams.get('pin');
        let registerParam = searchParams.get('register');

        // Also check hash for parameters if not found in search
        if (!pinId && !registerParam && window.location.hash.includes('?')) {
          const hashSearch = window.location.hash.split('?')[1];
          const hashParams = new URLSearchParams(hashSearch);
          pinId = hashParams.get('pin');
          registerParam = hashParams.get('register');
        }

        if (registerParam) {
          setIsRegisterModalOpen(true);
        }

        if (pinId) {
          const trimmedPinId = pinId.trim();
          // Resolve from combined pool (user-created pins + standard 1×1, wide 2×1, wide 3×1, featured 2×2)
          const fullLookupPool = [...(allListings || []), ...ALL_BOARD_LISTINGS];
          const found = fullLookupPool.find(
            (p) =>
              p.id === trimmedPinId ||
              String(p.id).toLowerCase() === trimmedPinId.toLowerCase()
          );
          if (found) {
            setSelectedCardForDetail(found);
          } else {
            const title = searchParams.get('title');
            if (title) {
              setSelectedCardForDetail({
                id: trimmedPinId,
                title: decodeURIComponent(title),
                category: decodeURIComponent(searchParams.get('category') || 'Community'),
                details: decodeURIComponent(searchParams.get('details') || 'Community board listing'),
                priceOrRate: decodeURIComponent(searchParams.get('price') || 'Contact Owner'),
                phone: decodeURIComponent(searchParams.get('phone') || '702-555-0100'),
                pinColor: 'red',
                gridSize: '1x1',
              });
            }
          }
        }
      } catch (err) {
        console.error('Error parsing QR pin parameters', err);
      }
    };

    checkUrlParams();
    window.addEventListener('popstate', checkUrlParams);
    window.addEventListener('hashchange', checkUrlParams);
    return () => {
      window.removeEventListener('popstate', checkUrlParams);
      window.removeEventListener('hashchange', checkUrlParams);
    };
  }, [allListings]);

  // Board details (from prop or default to Salam Market flagship)
  const boardConfig = {
    storeName: propBoardConfig?.storeName || 'Salam Market — Las Vegas',
    storeAddress: propBoardConfig?.storeAddress || '4750 W Flamingo Rd, Las Vegas, NV 89103',
    boardId: propBoardConfig?.boardId || 'SM-LV-001',
    status: propBoardConfig?.status || 'Online',
    screenType: propBoardConfig?.screenType || 'Commercial 4K Smart Display',
  };

  // Base URL for deep links encoded in QR codes
  const getBaseAppUrl = () => {
    if (
      typeof window !== 'undefined' &&
      window.location.origin &&
      window.location.origin !== 'null' &&
      !window.location.origin.startsWith('about:')
    ) {
      const origin = window.location.origin.replace(/\/+$/, '');
      const pathname = window.location.pathname || '/';
      return `${origin}${pathname}`;
    }
    return 'https://communityboard.local/';
  };

  const registrationUrl = `${getBaseAppUrl()}?manage=${encodeURIComponent(boardConfig.boardId)}`;

  // 4. Standard 1×1 Square Advertisements Pool (Row 1: 5 items, Row 2: 3 items, Row 3: 7 items = 15 total items per slide)
  const activeBasePool = allListings || SAMPLE_CORKBOARD_LISTINGS;
  const STANDARD_1X1_POOL = [
    ...activeBasePool.filter(
      (item) => item.gridSize !== '2x2' && item.gridSize !== '2x1'
    ),
    ...WIDE_3X1_POOL.map((item) => ({ ...item, gridSize: '1x1' as const })),
  ];

  // Filter listings based on category selection
  const filtered1x1Pool =
    selectedCategory === 'All'
      ? STANDARD_1X1_POOL
      : STANDARD_1X1_POOL.filter((i) =>
          i.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const itemsPerSlide = 15;
  const totalSlides = Math.max(1, Math.ceil(filtered1x1Pool.length / itemsPerSlide));

  // Determine current slide items with user-created listings included
  const allFeatured2x2 = [
    ...activeBasePool.filter((item) => item.gridSize === '2x2'),
    ...FEATURED_2X2_POOL,
  ];
  const slideFeatured2x2 =
    allFeatured2x2[currentSlideIndex % allFeatured2x2.length];

  const allWide2x1 = [
    ...activeBasePool.filter((item) => item.gridSize === '2x1'),
    ...WIDE_2X1_POOL,
  ];
  const slideWide2x1 =
    allWide2x1[currentSlideIndex % allWide2x1.length];

  const startIdx = (currentSlideIndex % totalSlides) * itemsPerSlide;
  const rawStandard15 = filtered1x1Pool.slice(startIdx, startIdx + itemsPerSlide);

  const standard15Items: ListingCardItem[] = [...rawStandard15];
  if (standard15Items.length < itemsPerSlide) {
    let padIndex = 0;
    while (standard15Items.length < itemsPerSlide) {
      const fallbackItem =
        filtered1x1Pool[padIndex % Math.max(1, filtered1x1Pool.length)] ||
        STANDARD_1X1_POOL[padIndex % STANDARD_1X1_POOL.length];
      standard15Items.push(fallbackItem);
      padIndex++;
    }
  }

  // Row 1 standard 1×1 items: 5 items (cols 3, 4, 5, 6, 7)
  const row1Items = standard15Items.slice(0, 5);

  // Row 2 center-right standard 1×1 items: 3 items (cols 5, 6, 7) - replacing former 3×1 wide promotional tile
  const row2Items = standard15Items.slice(5, 8);

  // Row 3 standard 1×1 items: 7 items (cols 1, 2, 3, 4, 5, 6, 7)
  const row3Items = standard15Items.slice(8, 15);

  // Auto-slide carousel ticker
  useEffect(() => {
    if (!isAutoPlay || totalSlides <= 1) {
      setProgress(0);
      return;
    }

    const intervalStepMs = 100;
    const totalSteps = (slideInterval * 1000) / intervalStepMs;

    const intervalTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / totalSteps;
        if (next >= 100) {
          setCurrentSlideIndex((oldIdx) => (oldIdx + 1) % totalSlides);
          setLastSyncTime('Just now');
          return 0;
        }
        return next;
      });
    }, intervalStepMs);

    return () => clearInterval(intervalTimer);
  }, [isAutoPlay, slideInterval, totalSlides]);

  // Reset to slide 0 when category changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setProgress(0);
  }, [selectedCategory]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  };

  // Fullscreen toggle
  const toggleBrowserFullscreen = () => {
    try {
      const el = (containerRef.current || document.documentElement) as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
        mozRequestFullScreen?: () => Promise<void> | void;
        msRequestFullscreen?: () => Promise<void> | void;
      };
      const doc = document as Document & {
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
        webkitExitFullscreen?: () => Promise<void> | void;
        mozCancelFullScreen?: () => Promise<void> | void;
        msExitFullscreen?: () => Promise<void> | void;
      };

      const isFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isFs) {
        if (typeof el?.requestFullscreen === 'function') {
          el.requestFullscreen().catch(() => {});
        } else if (typeof el?.webkitRequestFullscreen === 'function') {
          el.webkitRequestFullscreen();
        } else if (typeof el?.mozRequestFullScreen === 'function') {
          el.mozRequestFullScreen();
        } else if (typeof el?.msRequestFullscreen === 'function') {
          el.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (typeof doc.exitFullscreen === 'function') {
          doc.exitFullscreen().catch(() => {});
        } else if (typeof doc.webkitExitFullscreen === 'function') {
          doc.webkitExitFullscreen();
        } else if (typeof doc.mozCancelFullScreen === 'function') {
          doc.mozCancelFullScreen();
        } else if (typeof doc.msExitFullscreen === 'function') {
          doc.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navBarRef.current &&
        !navBarRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown('none');
      }
    };
    if (activeDropdown !== 'none') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const categories = ['All', 'Housing', 'For Sale', 'Services', 'Jobs', 'Community', 'Events'];

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return SAMPLE_CORKBOARD_LISTINGS.length;
    return SAMPLE_CORKBOARD_LISTINGS.filter((item) =>
      item.category.toLowerCase().includes(cat.toLowerCase())
    ).length;
  };

  const activeTvProfile =
    TV_SCREEN_PROFILES.find((p) => p.id === selectedTvProfileId) || TV_SCREEN_PROFILES[0];

  const activeTileScale = calculateTileGridPercentages({
    tileUnit: calculatorTileSize,
    containerWidth,
    selectedTvProfileId,
    gapPx: 12,
  });

  const handleCopyBoardId = () => {
    navigator.clipboard.writeText(boardConfig.boardId);
    setCopiedBoardId(true);
    setTimeout(() => setCopiedBoardId(false), 2000);
  };

  /**
   * Unified Advertisement Tile Component matching master design reference:
   * - Rounded advertisement cards with fine caramel borders (#D4A276)
   * - Warm cream surface (#FFFDF9)
   * - Dark chocolate brown title bar on individual ads (#583101)
   * - Small circular caramel pin/nail centered at the top of every tile (#D4A276)
   * - Soft, restrained shadow
   * - Responsive image with correct crop, no stretching
   * - Bold compact dark title, brief readable description, phone icon & number
   * - Real scannable high-contrast QR code with scan prompt
   * - Zero element overflow beyond card boundaries
   */
  const renderAdvertisementTile = (
    item: ListingCardItem,
    size: TileGridSize,
    colStart: number,
    rowStart: number,
    colSpan: number,
    rowSpan: number
  ) => {
    const isPhoneRevealed = revealedPhoneId === item.id;
    const displayImage = getDisplayImage(item);

    // Deep link URL for QR Code - compact & direct for fast mobile camera scanning
    const tileQrUrl = `${getBaseAppUrl()}?pin=${encodeURIComponent(item.id)}`;

    // QR Canvas Pixel Dimensions: Sized identically to footer nav bar QR Code (30px)
    const qrCanvasSize = 30;

    return (
      <div
        key={`${item.id}-${size}-${colStart}-${rowStart}`}
        onClick={() => setSelectedCardForDetail(item)}
        style={{
          gridColumn: `${colStart} / span ${colSpan}`,
          gridRow: `${rowStart} / span ${rowSpan}`,
        }}
        className="relative h-full w-full group cursor-pointer select-none transition-transform duration-200 hover:-translate-y-0.5 hover:z-30 overflow-visible"
      >
        {/* 
          UNCLIPPED FULL CIRCULAR PIN HEAD / THUMBTACK
          Compact circular caramel/bronze thumbtack centered at top edge of EVERY tile.
          Placed on the unclipped outer container so the ENTIRE circular pin head is 100% fully visible,
          scaled smaller (12px - 14px) with rich 3D dome gradient, specular highlight, center tack core, and drop shadow.
        */}
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none filter drop-shadow-[0_2px_3px_rgba(50,25,5,0.35)]">
          <div className="tile-pin-head w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full aspect-square shrink-0 bg-gradient-to-br from-[#FFF0DE] via-[#D4A276] to-[#7B4B1C] border border-[#4A2600] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.2)] relative flex items-center justify-center">
            {/* Glossy specular highlight */}
            <div className="absolute top-[1.5px] left-[1.5px] w-1 h-1 rounded-full bg-white/95 shadow-xs pointer-events-none" />
            {/* Center metallic tack core */}
            <div className="w-1 h-1 rounded-full bg-[#4A2600]/30 border border-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Card Body Container with internal overflow clipping */}
        <div className="bg-[#FFFDF9] rounded-xl sm:rounded-2xl shadow-xs group-hover:shadow-md transition-shadow duration-200 border border-[#D4A276] flex flex-col overflow-hidden h-full w-full">

        {/* 
          1. DARK BROWN TITLE BAR / CATEGORY STRIP
          - Dark brown background (#583101)
          - Category icon in gold/white
          - Uppercase category label
          - Cream-colored price or status pill aligned to the right
          - No verified badge, no text overflow
        */}
        <div className="bg-[#583101] text-[#FFEDD8] px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between gap-1.5 shrink-0 min-w-0 overflow-hidden text-[10px] sm:text-[11px] leading-tight select-none border-b border-[#603808]">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            {getCategoryIcon(item.category)}
            <span className="font-extrabold uppercase tracking-wider truncate font-sans text-[9px] sm:text-[10px] text-[#FFEDD8]">
              {item.category}
            </span>
          </div>

          {/* Cream price / status badge */}
          {item.priceOrRate && (
            <span className="font-mono font-bold text-[9px] sm:text-[10px] bg-[#FFEDD8] text-[#583101] px-1.5 py-0.5 rounded border border-[#D4A276] shrink-0 truncate max-w-[50%] text-right shadow-2xs">
              {item.priceOrRate}
            </span>
          )}
        </div>

        {/* 
          2. PHOTO / IMAGE AREA
          - Edge-to-edge photograph, correct crop, no distortion
          - In 2×1 & 3×1: Wide panoramic landscape photo
          - In 1×1: Fills available card width proportionally
        */}
        <div className="min-h-0 flex-1 w-full h-full relative overflow-hidden bg-[#F3D5B5]/20">
          <img
            src={displayImage}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getLogicalPlaceholderImage(
                item.category,
                item.title
              );
            }}
          />
        </div>

        {/* 
          3. CONTENT AREA: TITLE, DESCRIPTION, PHONE & QR CODE
          - Bold dark-brown heading immediately below image (#583101)
          - Brief, readable supporting details
          - Large telephone icon and bold phone number
          - High-contrast square QR code near lower-right with scan prompt
          - Text strictly constrained within assigned boundaries
        */}
        <div className="p-1.5 sm:p-2 bg-[#FFFDF9] border-t border-[#E7BC91]/60 shrink-0 min-w-0 overflow-hidden ad-contact-row flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Left Sub-Section: Heading, Description & Phone (Takes priority) */}
          <div className="ad-contact-details overflow-hidden flex flex-col justify-between gap-0.5 sm:gap-1 flex-1 min-w-0">
            <h4
              className="font-bold text-[#583101] truncate text-[10px] sm:text-[11px] leading-tight group-hover:text-[#8B5E34] transition-colors block"
              title={item.title}
            >
              {item.title}
            </h4>

            {/* Description text */}
            {item.details && (
              <p className="text-[9px] sm:text-[10px] text-[#8B5E34] leading-tight truncate">
                {item.details}
              </p>
            )}

            {/* Contact phone number button */}
            <div className="flex items-center min-w-0 overflow-hidden pt-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRevealedPhoneId(isPhoneRevealed ? null : item.id);
                }}
                className="py-0.5 px-1 sm:px-1.5 rounded bg-[#FFEDD8] hover:bg-[#F3D5B5] border border-[#D4A276] text-[9px] sm:text-[10px] font-mono text-[#583101] font-semibold flex items-center gap-1 transition-colors truncate max-w-full text-left cursor-pointer ad-contact-details__phone"
                title="Click to reveal phone number or dial"
              >
                <Phone className="w-2.5 h-2.5 text-[#8B5E34] shrink-0" />
                <span className="truncate">
                  {isPhoneRevealed ? item.phone : `📞 ${item.phone}`}
                </span>
              </button>
            </div>
          </div>

          {/* Right Sub-Section: Functional QR Code container sized identically to footer nav bar QR code */}
          <div
            className="ad-qr shrink-0 self-center hover:scale-105 transition-transform cursor-pointer"
            role="button"
            tabIndex={0}
            title={`Scan QR code to view ${item.title} on phone, or click for details`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCardForDetail(item);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                setSelectedCardForDetail(item);
              }
            }}
          >
            <QRCodeCanvas
              value={tileQrUrl}
              size={qrCanvasSize}
              className="object-contain block"
              darkColor="#24140A"
              lightColor="#FFFFFF"
              errorCorrectionLevel="L"
              ariaLabel={`Scan QR code for ${item.title}`}
            />
            <span className="ad-qr__caption">
              Scan
            </span>
          </div>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col select-none overflow-hidden bg-[#2D170A] text-[#583101] font-sans ${
        isEmbedded
          ? 'h-full rounded-2xl border-4 border-[#583101] shadow-2xl'
          : 'fixed inset-0 z-50 h-screen w-screen p-1 sm:p-2 bg-[#2D170A]'
      }`}
    >
      {/* 
        A. OUTER SCREEN FRAME
        - Thick, rounded, dark-brown border encloses the entire display (#583101)
        - Thin secondary caramel outline / ring (#D4A276)
        - Cream-colored interior with subtle warm shading
        - Consistent visual boundary between board and TV bezel
        - Zero element overflow outside the frame
      */}
      <div className="w-full h-full flex flex-col rounded-[22px] sm:rounded-[28px] border-[10px] sm:border-[14px] border-[#583101] ring-2 ring-[#D4A276] shadow-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FFEDD8]/40 overflow-hidden relative">
        {/* 
          B. TOP NAVIGATION BAR
          Spans the full usable width and remains visually separate from advertisements.
        */}
        <header
          ref={navBarRef}
          className="bg-[#FFFDF9] px-3 sm:px-5 py-2 sm:py-2.5 border-b-2 border-[#D4A276] shadow-xs flex items-center justify-between gap-2 shrink-0 relative z-30"
        >
          {/* Left Side: Store/community logo, bold title, category line */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink min-w-0">
            {/* Store logo in rounded dark-brown square with caramel border */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#583101] border border-[#D4A276] flex items-center justify-center text-amber-300 shadow-sm shrink-0 select-none">
              <Store className="w-5 h-5 text-amber-300" />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-bold font-serif text-[#583101] tracking-tight whitespace-nowrap leading-tight truncate">
                  Digital Community Board
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#583101] bg-[#FFEDD8] px-1.5 py-0.2 rounded border border-[#D4A276] leading-tight hidden lg:inline-flex items-center gap-1">
                  <span>{activeTvProfile.diagonalInches}</span>
                  <span>·</span>
                  <span>{activeTvProfile.physicalDimensions}</span>
                </span>
              </div>
              {/* Category subtitle */}
              <p
                title="Buy · Sell · Rent · Jobs · Services · Events"
                className="text-[#8B5E34] text-[11px] sm:text-xs font-medium tracking-wide whitespace-nowrap leading-tight truncate overflow-hidden text-ellipsis select-none"
              >
                Buy · Sell · Rent · Jobs · Services · Events
              </p>
            </div>

            {/* Thin vertical caramel divider */}
            <div className="h-8 w-px bg-[#D4A276] mx-2 hidden sm:block shrink-0" />
          </div>

          {/* Right Side: Deep-brown rounded buttons with gold icons & cream playback container */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
            {/* 1. Home Button */}
            <button
              onClick={() => {
                setCurrentSlideIndex(0);
                setSelectedCategory('All');
                setActiveDropdown('none');
              }}
              className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-[#583101] hover:bg-[#603808] text-amber-300 border border-[#D4A276]/60 flex items-center gap-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Return to Home Slide & Reset Filters"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span className="hidden md:inline text-[11px]">Home</span>
            </button>

            {/* 2. Display Selection with Monitor Icon and Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'display' ? 'none' : 'display')}
                className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl border transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                  activeDropdown === 'display'
                    ? 'bg-[#603808] text-amber-300 border-[#D4A276] ring-2 ring-amber-400/30'
                    : 'bg-[#583101] hover:bg-[#603808] text-amber-300 border-[#D4A276]/60'
                }`}
                title={`Display Selection (Current: ${activeTvProfile.label})`}
                aria-label="Display Selection"
                aria-expanded={activeDropdown === 'display'}
              >
                <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span className="hidden md:inline text-[11px] font-semibold">Display</span>
                <ChevronDown
                  className={`w-3 h-3 text-amber-300/80 transition-transform duration-200 ${
                    activeDropdown === 'display' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Display selection dropdown */}
              {activeDropdown === 'display' && (
                <div className="fixed sm:absolute left-2 sm:left-auto right-2 sm:right-0 top-14 sm:top-full mt-1.5 w-[calc(100vw-16px)] sm:w-80 bg-[#583101] text-[#FFEDD8] rounded-xl shadow-2xl border-2 border-[#D4A276] p-3 z-50 animate-fade-in text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D4A276]/40 mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                      <Monitor className="w-4 h-4" />
                      <span>TV Display Sizing Profiles</span>
                    </div>
                    <button
                      onClick={() => setActiveDropdown('none')}
                      className="p-1 rounded text-stone-300 hover:text-white"
                      aria-label="Close Display Menu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-stone-300 mb-2 leading-tight">
                    Calibrated for commercial 16:9 widescreen television displays:
                  </p>

                  <div className="space-y-1 mb-2.5">
                    {TV_SCREEN_PROFILES.map((profile) => {
                      const isSelected = selectedTvProfileId === profile.id;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => {
                            setSelectedTvProfileId(profile.id);
                            setActiveDropdown('none');
                          }}
                          className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between border cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B5E34] text-white border-amber-400 font-bold shadow-xs'
                              : 'bg-black/25 text-[#FFEDD8] border-[#603808] hover:bg-black/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold w-12 shrink-0 text-amber-300">
                              {profile.diagonalInches}
                            </span>
                            <div>
                              <span className="text-[11px] font-semibold block flex items-center gap-1">
                                {profile.label}
                                {profile.isBaseline && (
                                  <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1 rounded border border-amber-400/40 font-mono">
                                    Baseline
                                  </span>
                                )}
                              </span>
                              <span className="text-[9px] text-stone-300 block font-mono">
                                {profile.physicalDimensions} · 7×3 Grid
                              </span>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 bg-black/30 rounded border border-[#D4A276]/30 text-[9px] text-stone-300 space-y-0.5">
                    <p className="font-semibold text-amber-300">TV Physical Dimension Reference:</p>
                    <p>• 75″ TV: 65.4″ × 36.8″ (Reference baseline)</p>
                    <p>• 65″ TV: 56.7″ × 31.9″ (Scaled to fit)</p>
                    <p>• 85″ TV: 74.1″ × 41.7″ (Scaled to fit)</p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Category / Filters Selection */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'filters' ? 'none' : 'filters')}
                className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl border transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                  activeDropdown === 'filters'
                    ? 'bg-[#603808] text-amber-300 border-[#D4A276] ring-2 ring-amber-400/30'
                    : 'bg-[#583101] hover:bg-[#603808] text-amber-300 border-[#D4A276]/60'
                }`}
                title={`Filter Categories (Current: ${selectedCategory})`}
                aria-label="Filters"
                aria-expanded={activeDropdown === 'filters'}
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span className="hidden md:inline text-[11px] font-semibold">Filters</span>
                <ChevronDown
                  className={`w-3 h-3 text-amber-300/80 transition-transform duration-200 ${
                    activeDropdown === 'filters' ? 'rotate-180' : ''
                  }`}
                />
                {selectedCategory !== 'All' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 -mr-0.5" />
                )}
              </button>

              {/* Filters dropdown */}
              {activeDropdown === 'filters' && (
                <div className="fixed sm:absolute left-2 sm:left-auto right-2 sm:right-0 top-14 sm:top-full mt-1.5 w-[calc(100vw-16px)] sm:w-72 bg-[#583101] text-[#FFEDD8] rounded-xl shadow-2xl border-2 border-[#D4A276] p-3 z-50 animate-fade-in text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D4A276]/40 mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                      <Filter className="w-4 h-4" />
                      <span>Category Filters</span>
                    </div>
                    <button
                      onClick={() => setActiveDropdown('none')}
                      className="p-1 rounded text-stone-300 hover:text-white"
                      aria-label="Close Filters Menu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      const count = getCategoryCount(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setActiveDropdown('none');
                            setCurrentSlideIndex(0);
                          }}
                          className={`w-full p-2 rounded-lg text-left transition-all flex items-center justify-between border cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B5E34] text-white border-amber-400 font-bold shadow-xs'
                              : 'bg-black/25 text-[#FFEDD8] border-[#603808] hover:bg-black/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(cat)}
                            <span className="text-[11px] font-medium">
                              {cat === 'All' ? 'All Advertisements' : cat}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-amber-300">
                              {count}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Settings Button */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'settings' ? 'none' : 'settings')}
                className={`p-1.5 sm:px-2.5 sm:py-2 rounded-xl border transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                  activeDropdown === 'settings'
                    ? 'bg-[#603808] text-amber-300 border-[#D4A276] ring-2 ring-amber-400/30'
                    : 'bg-[#583101] hover:bg-[#603808] text-amber-300 border-[#D4A276]/60'
                }`}
                title="Board & Slideshow Settings"
                aria-label="Settings"
                aria-expanded={activeDropdown === 'settings'}
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span className="hidden md:inline text-[11px] font-semibold">Settings</span>
              </button>

              {/* Settings popup */}
              {activeDropdown === 'settings' && (
                <div className="fixed sm:absolute left-2 sm:left-auto right-2 top-14 sm:top-full mt-1.5 w-[calc(100vw-16px)] sm:w-96 bg-[#583101] text-[#FFEDD8] rounded-xl shadow-2xl border-2 border-[#D4A276] p-3.5 z-50 animate-fade-in text-xs">
                  <div className="flex items-start justify-between pb-2 border-b border-[#D4A276]/40 mb-2.5">
                    <div className="flex items-center gap-2 text-white font-serif font-bold text-sm">
                      <Settings className="w-4 h-4 text-amber-300" />
                      <span>Display & Slideshow Settings</span>
                    </div>
                    <button
                      onClick={() => setActiveDropdown('none')}
                      className="p-1 rounded text-stone-300 hover:text-white"
                      aria-label="Close Settings Menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Slide duration */}
                    <div>
                      <span className="text-[11px] font-semibold text-amber-300 block mb-1.5">
                        Slide Rotation Speed:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[5, 10, 15, 20, 30].map((sec) => (
                          <button
                            key={sec}
                            onClick={() => {
                              setSlideInterval(sec);
                              setProgress(0);
                            }}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                              slideInterval === sec
                                ? 'bg-amber-500 text-stone-900 font-bold'
                                : 'bg-black/30 text-[#FFEDD8] hover:bg-black/50'
                            }`}
                          >
                            {sec}s
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Board identification */}
                    <div className="p-2.5 rounded bg-black/30 border border-[#D4A276]/30 text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-300">Board Identity:</span>
                        <span className="font-mono font-bold text-amber-300">{boardConfig.boardId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-300">Hardware Profile:</span>
                        <span className="font-semibold text-white">{activeTvProfile.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-300">Physical Sizing:</span>
                        <span className="font-mono text-emerald-400">{activeTvProfile.physicalDimensions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Cream-Colored Playback Container: Previous, Play/Pause (Green icon), Next, Counter */}
            <div className="flex items-center gap-1 bg-[#FFEDD8] p-0.5 sm:p-1 rounded-xl border border-[#D4A276] text-[#583101] shadow-2xs shrink-0">
              <button
                onClick={handlePrevSlide}
                className="p-1 rounded-lg hover:bg-[#F3D5B5] text-[#583101] transition-colors cursor-pointer"
                title="Previous Slide"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-1 rounded-lg hover:bg-[#F3D5B5] text-[#583101] transition-colors cursor-pointer flex items-center justify-center"
                title={isAutoPlay ? 'Pause Auto-Rotation' : 'Play Auto-Rotation'}
                aria-label={isAutoPlay ? 'Pause' : 'Play'}
              >
                {isAutoPlay ? (
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D97706]" />
                ) : (
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] fill-[#16A34A]" />
                )}
              </button>

              <button
                onClick={handleNextSlide}
                className="p-1 rounded-lg hover:bg-[#F3D5B5] text-[#583101] transition-colors cursor-pointer"
                title="Next Slide"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Current Slide Indicator (e.g. 1/4) */}
              <span className="font-mono font-bold text-[10px] sm:text-[11px] text-[#583101] px-1 sm:px-1.5 select-none border-l border-[#D4A276] ml-0.5">
                {currentSlideIndex + 1}/{totalSlides}
              </span>
            </div>

            {/* 6. Full-Screen Button */}
            <button
              onClick={toggleBrowserFullscreen}
              className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-[#583101] hover:bg-[#603808] text-amber-300 border border-[#D4A276]/60 shadow-xs transition-colors flex items-center justify-center cursor-pointer"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              aria-label="Full Screen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              )}
            </button>

            {/* 7. Close Button */}
            {onExitFullscreen && (
              <button
                onClick={onExitFullscreen}
                className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-[#583101] hover:bg-[#603808] text-amber-300 border border-[#D4A276]/60 shadow-xs transition-colors flex items-center justify-center cursor-pointer"
                title="Close Display View"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              </button>
            )}
          </div>
        </header>

        {/* Subtle Slide Countdown Progress Line */}
        <div className="w-full bg-[#E7BC91]/40 h-1 shrink-0 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#D4A276] via-[#A47148] to-[#583101] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 
          MAIN ADVERTISEMENT GRID
          Warm cream interior with subtle warm shading.
          The design follows a 7-column × 3-row landscape grid:
          - 2×2 (20″ × 20″) Large featured advertisement positioned at upper-left (cols 1-2, rows 1-2)
          - 5 1×1 standard square advertisements across Row 1 (cols 3-7, row 1)
          - 2×1 wide promotional advertisement positioned toward center-left (cols 3-4, row 2)
          - 3 1×1 standard square advertisements positioned toward center-right (cols 5-7, row 2)
          - 7 1×1 standard square advertisements across Row 3 (cols 1-7, row 3)
        */}
        <main className="flex-1 min-h-0 overflow-auto pt-4 sm:pt-4.5 md:pt-5 px-2 sm:px-3 md:px-3.5 pb-2 sm:pb-3 md:pb-3.5 flex flex-col justify-between">
          <div
            key={`slide-${currentSlideIndex}-${selectedTvProfileId}`}
            className="flex-1 min-h-0 w-full animate-slide-page flex flex-col overflow-visible"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
                gap: 'clamp(8px, 0.8vw, 14px)',
              }}
              className="w-full h-full min-h-[580px] sm:min-h-[620px] md:min-h-0 flex-1 overflow-visible"
            >
              {/* 
                1. 2×2 (20″ × 20″): LARGE FEATURED ADVERTISEMENT AT TOP-LEFT
                Position: Column 1..2, Row 1..2
              */}
              {renderAdvertisementTile(slideFeatured2x2, '2x2', 1, 1, 2, 2)}

              {/* 
                2. ROW 1 (COLS 3 TO 7): FIVE 1×1 STANDARD SQUARE ADVERTISEMENTS
              */}
              {row1Items.map((item, idx) =>
                renderAdvertisementTile(item, '1x1', 3 + idx, 1, 1, 1)
              )}

              {/* 
                3. ROW 2 CENTER-LEFT (COLS 3 TO 4): 2×1 WIDE PROMOTIONAL ADVERTISEMENT
              */}
              {renderAdvertisementTile(slideWide2x1, '2x1', 3, 2, 2, 1)}

              {/* 
                4. ROW 2 CENTER-RIGHT (COLS 5 TO 7): THREE 1×1 STANDARD SQUARE ADVERTISEMENTS
                (Upgraded: Replaced 3×1 Wide Tile with three 1×1 Standard Tiles)
              */}
              {row2Items.map((item, idx) =>
                renderAdvertisementTile(item, '1x1', 5 + idx, 2, 1, 1)
              )}

              {/* 
                5. ROW 3 (COLS 1 TO 7): SEVEN 1×1 STANDARD SQUARE ADVERTISEMENTS
              */}
              {row3Items.map((item, idx) =>
                renderAdvertisementTile(item, '1x1', 1 + idx, 3, 1, 1)
              )}
            </div>
          </div>
        </main>

        {/* 
          4. BOTTOM INFORMATION BAR (FOOTER)
          Matches the reference specification exactly:
          - Register This Screen with QR code & instructions
          - Displaying at: Store Name — City & Address
          - Board ID: SM-LV-001
          - Status: Online (green indicator), Last synchronization time, Network connected
        */}
        <footer className="bg-[#FFFDF9] border-t-2 border-[#D4A276] px-3 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-3 text-xs text-[#583101] shrink-0 z-20 shadow-xs">
          {/* Group 1: Registration QR Code & Instructions - Proportionally set & interactive */}
          <div
            onClick={() => setIsRegisterModalOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsRegisterModalOpen(true);
              }
            }}
            className="footer-registration min-w-0 shrink-0 cursor-pointer group flex items-center gap-2 hover:bg-[#FFEDD8]/40 px-2 py-1 -my-0.5 rounded-lg transition-colors border border-transparent hover:border-[#D4A276]/60"
            role="button"
            tabIndex={0}
            title="Click or scan QR code to register and manage this display screen"
          >
            <div className="footer-registration-qr shrink-0 group-hover:scale-105 transition-transform">
              <QRCodeCanvas
                value={registrationUrl}
                size={30}
                className="object-contain block"
                darkColor="#24140A"
                lightColor="#FFFFFF"
                errorCorrectionLevel="L"
                ariaLabel="Scan QR code to register this screen"
              />
            </div>
            <div className="footer-registration__text justify-center min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#583101] text-[#FFEDD8] font-bold text-[8px] sm:text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wider leading-none">
                  REGISTER
                </span>
                <span className="footer-registration__title font-serif text-[#583101] tracking-tight leading-tight group-hover:text-[#8B4513]">
                  Register This Screen
                </span>
              </div>
              <p className="footer-registration__description text-[#8B5E34] truncate mt-0.5 hidden xs:block">
                Scan QR code to register and manage this display.
              </p>
            </div>
          </div>

          {/* Thin vertical caramel divider */}
          <div className="h-8 w-px bg-[#D4A276] mx-1 hidden md:block shrink-0" />

          {/* Group 2: Displaying at: Store Name & Physical Address + Store Specials */}
          <div className="flex items-center gap-2 min-w-0 shrink">
            <div className="w-7 h-7 rounded-lg bg-[#FFEDD8] border border-[#D4A276] flex items-center justify-center text-amber-800 shrink-0">
              <Store className="w-3.5 h-3.5 text-[#583101]" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-[#8B5E34] font-semibold block leading-tight">
                Displaying at:
              </span>
              <p className="font-serif font-bold text-xs text-[#583101] truncate leading-tight">
                {boardConfig.storeName}
              </p>
              <p className="text-[10px] text-[#8B5E34] truncate leading-tight hidden xl:block">
                {boardConfig.storeAddress}
              </p>
            </div>

            {/* Store Specials action button */}
            <button
              onClick={() => setIsSpecialsModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFEDD8] hover:bg-[#F3D5B5] text-[#583101] border border-[#D4A276] text-[10px] sm:text-[11px] font-bold shadow-2xs transition-colors cursor-pointer ml-1 shrink-0"
              title="View host store specials list and post daily deals"
            >
              <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" />
              <span>Store Specials</span>
            </button>
          </div>

          {/* Thin vertical caramel divider */}
          <div className="h-8 w-px bg-[#D4A276] mx-1 hidden lg:block shrink-0" />

          {/* Group 3: Board ID with quick copy control */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[9px] uppercase tracking-wider text-[#8B5E34] font-semibold block leading-tight">
                Board ID
              </span>
            </div>
            <button
              onClick={handleCopyBoardId}
              className="px-2 py-1 rounded-lg bg-[#FFEDD8] hover:bg-[#F3D5B5] border border-[#D4A276] text-[#583101] font-mono font-bold text-[10px] sm:text-[11px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Click to copy Board ID"
            >
              <span>{boardConfig.boardId}</span>
              {copiedBoardId ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-[#8B5E34]" />
              )}
            </button>
          </div>

          {/* Thin vertical caramel divider */}
          <div className="h-8 w-px bg-[#D4A276] mx-1 hidden sm:block shrink-0" />

          {/* Group 4: Status Online (Green dot), Last Sync, Network Connected */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-[11px] text-emerald-800 flex items-center gap-1">
                  Status: Online
                </span>
                <span className="text-[9px] text-[#8B5E34] hidden md:inline">
                  Last sync: {lastSyncTime}
                </span>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-medium">
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span>Connected</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 
        SCREEN REGISTRATION & MANAGEMENT MODAL (When footer QR code or Register button is clicked/scanned)
      */}
      <RegisterScreenModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        boardConfig={boardConfig}
        registrationUrl={registrationUrl}
        onOpenStoreDashboard={onOpenStoreDashboard}
        onOpenManageList={onOpenManageList}
      />

      {/* 
        DETAIL PAGE MODAL (When any tile or QR code is clicked)
      */}
      <PinDetailModal
        item={selectedCardForDetail}
        onClose={() => setSelectedCardForDetail(null)}
        storeName={boardConfig.storeName}
      />

      {/* 
        STORE SPECIALS MODAL (When bottom footer Store Specials button is clicked)
      */}
      <StoreSpecialsModal
        isOpen={isSpecialsModalOpen}
        onClose={() => setIsSpecialsModalOpen(false)}
        storeName={boardConfig.storeName}
        onOpenStoreDashboard={onOpenStoreDashboard}
      />
    </div>
  );
};
