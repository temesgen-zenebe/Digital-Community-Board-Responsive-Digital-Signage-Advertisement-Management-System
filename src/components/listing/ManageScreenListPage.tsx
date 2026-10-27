import React, { useState, useEffect } from 'react';
import {
  Tv,
  Store,
  Tag,
  Plus,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Phone,
  Eye,
  QrCode,
  MapPin,
  Flame,
  Search,
  Filter,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Smartphone,
  AlertCircle,
  Copy,
  Lock,
  Layers,
  Calendar,
  Percent,
} from 'lucide-react';
import { type ListingCardItem, type TileGridSize, getDisplayImage } from '../../data/findingsData';
import { type BoardHardwareConfig, INITIAL_BOARDS, INITIAL_STORES, type StorePartner } from '../../data/boardsData';
import { QRCodeCanvas } from '../common/QRCodeCanvas';

interface ManageScreenListPageProps {
  boardId?: string;
  onBackToKiosk: () => void;
  onBackToAdmin?: () => void;
  onListingActivated?: (newListing: ListingCardItem) => void;
  onViewLiveBoard?: () => void;
  allListings: ListingCardItem[];
}

// Preset photo options for quick 1-click selection
const PRESET_COMMUNITY_IMAGES = [
  {
    label: 'Injera & Ethiopian Catering',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Apartment / Room Rental',
    category: 'Housing',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Coffee Ceremony & Jebena',
    category: 'For Sale',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Barber & Hair Braiding',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Halal Butchery & Meat',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Math / Language Tutoring',
    category: 'Services',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Auto & Delivery Van',
    category: 'For Sale',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  },
];

// Tile configuration and base daily rates
export const TILE_SIZE_CONFIGS: Record<
  '1x1' | '2x1' | '2x2',
  { dailyRate: number; label: string; badge: string; dimensions: string; description: string }
> = {
  '1x1': {
    dailyRate: 2.0,
    label: '1×1 Standard Tile',
    badge: 'Standard 1×1',
    dimensions: '1 Col × 1 Row (Square)',
    description: 'Classic corkboard flyer tile. Perfect for services, room rentals, jobs, and community trade.',
  },
  '2x1': {
    dailyRate: 3.5,
    label: '2×1 Wide Banner Tile',
    badge: 'Wide Banner 2×1',
    dimensions: '2 Cols × 1 Row (Horizontal)',
    description: 'Panoramic wide banner with 2× headline width. Great for special discounts and upcoming events.',
  },
  '2x2': {
    dailyRate: 6.0,
    label: '2×2 Featured Mega Poster',
    badge: 'Mega Poster 2×2',
    dimensions: '2 Cols × 2 Rows (Featured)',
    description: 'Prime top-left placement with maximum visibility, large photo showcase, and high-impact design.',
  },
};

export const ManageScreenListPage: React.FC<ManageScreenListPageProps> = ({
  boardId = 'SM-LV-001',
  onBackToKiosk,
  onBackToAdmin,
  onListingActivated,
  onViewLiveBoard,
  allListings,
}) => {
  // Find associated board and store info that triggered the link
  const targetBoard =
    INITIAL_BOARDS.find((b) => b.id.toLowerCase() === boardId.toLowerCase()) ||
    INITIAL_BOARDS[0];
  const targetStore =
    INITIAL_STORES.find((s) => s.id === targetBoard.storeId) || INITIAL_STORES[0];

  // Active view tabs: 'list' (user list on this screen) vs 'create' (add listing & checkout)
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // Search & category filter in user list
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Listings managed in this session
  const [screenListings, setScreenListings] = useState<ListingCardItem[]>(allListings);

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Services');
  const [priceOrRate, setPriceOrRate] = useState('$25/hr');
  const [phone, setPhone] = useState('(702) 555-0199');
  const [details, setDetails] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(PRESET_COMMUNITY_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [gridSize, setGridSize] = useState<'1x1' | '2x1' | '2x2'>('1x1');
  const [pinColor, setPinColor] = useState<'red' | 'blue' | 'green' | 'yellow' | 'purple'>('red');

  // MULTIPLE STORE PREFERENCES (Trigger store enforced and selected by default)
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([targetStore.id]);

  // MINIMUM / MAXIMUM DAYS LISTED (Min: 3 days, Max: 90 days, Default: 7 days)
  const [durationDays, setDurationDays] = useState<number>(7);

  // Checkout & Instant 1-Second SuperAdmin Check Flow State
  const [step, setStep] = useState<'form' | 'checkout' | 'activating' | 'confirmed'>('form');
  const [countdownMs, setCountdownMs] = useState(1000);
  const [createdItem, setCreatedItem] = useState<ListingCardItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Ensure origin store is always retained if targetStore updates
  useEffect(() => {
    if (targetStore?.id && !selectedStoreIds.includes(targetStore.id)) {
      setSelectedStoreIds((prev) => [targetStore.id, ...prev.filter((id) => id !== targetStore.id)]);
    }
  }, [targetStore.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activePhoto = customImageUrl || selectedImageUrl;

  // Toggle store preference (Trigger store is enforced and cannot be deselected)
  const handleToggleStore = (storeId: string) => {
    if (storeId === targetStore.id) {
      showToast(`Origin Host Store (${targetStore.name}) is enforced and required.`);
      return;
    }
    setSelectedStoreIds((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  // Quick store selection shortcuts
  const selectOriginStoreOnly = () => {
    setSelectedStoreIds([targetStore.id]);
    showToast(`Broadcasting to origin store only: ${targetStore.name}`);
  };

  const selectLocalMetroStores = () => {
    const localStores = INITIAL_STORES.filter((s) => s.state === targetStore.state);
    const ids = Array.from(new Set([targetStore.id, ...localStores.map((s) => s.id)]));
    setSelectedStoreIds(ids);
    showToast(`Selected ${ids.length} stores in ${targetStore.state} metro network!`);
  };

  const selectAllPartnerStores = () => {
    const allIds = INITIAL_STORES.map((s) => s.id);
    setSelectedStoreIds(allIds);
    showToast(`Selected all ${allIds.length} cultural markets fleet-wide!`);
  };

  // PRICING CALCULATION ENGINE
  const tileConfig = TILE_SIZE_CONFIGS[gridSize] || TILE_SIZE_CONFIGS['1x1'];
  const baseDailyRate = tileConfig.dailyRate;

  // Raw base total: (Tile Rate * Duration Days) * Number of Selected Stores
  const storeCount = selectedStoreIds.length;
  const rawSubtotal = baseDailyRate * durationDays * storeCount;

  // Discounts based on duration and volume
  const durationDiscountPct =
    durationDays >= 60 ? 0.2 : durationDays >= 30 ? 0.15 : durationDays >= 14 ? 0.1 : 0;
  const multiStoreDiscountPct = storeCount >= 3 ? 0.1 : 0;
  const totalDiscountPct = durationDiscountPct + multiStoreDiscountPct;
  const totalDiscountAmount = rawSubtotal * totalDiscountPct;
  const finalPrice = Math.max(5, rawSubtotal - totalDiscountAmount);

  // 65% Grocer Direct Revenue Share Breakdown
  const grocerShareTotal = finalPrice * 0.65;
  const grocerSharePerStore = grocerShareTotal / storeCount;
  const platformShare = finalPrice * 0.35;

  // Handle Form Submission -> Proceeds to Quick Checkout
  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an ad title');
      return;
    }

    const newItem: ListingCardItem = {
      id: `user-pin-${Date.now()}`,
      title: title.trim(),
      category,
      priceOrRate: priceOrRate.trim() || 'Contact for info',
      phone: phone.trim() || '(702) 555-0100',
      details:
        details.trim() ||
        'Verified community flyer posted directly to in-store digital corkboard display screen.',
      imageUrl: activePhoto,
      gridSize,
      pinColor,
      featured: gridSize === '2x2',
      targetStoreIds: selectedStoreIds,
      durationDays,
      totalCost: finalPrice,
    };

    setCreatedItem(newItem);
    setStep('checkout');
  };

  // Handle Checkout Execution -> Starts 1-second SuperAdmin instant activation
  const handleExecuteCheckout = () => {
    if (!createdItem) return;
    setStep('activating');
    setCountdownMs(1000);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1000 - elapsed);
      setCountdownMs(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        // Instant SuperAdmin check PASSED!
        setStep('confirmed');

        // Prepend new listing to user list
        setScreenListings([createdItem, ...screenListings]);

        // Propagate up to corkboard and super admin
        if (onListingActivated) {
          onListingActivated(createdItem);
        }
        showToast('✓ Listing approved & activated by SuperAdmin in 1 second!');
      }
    }, 50);
  };

  // Filtered listings for the User List tab
  const filteredListings = screenListings.filter((item) => {
    const matchesCat =
      categoryFilter === 'All' ||
      item.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const categories = ['All', 'Services', 'Housing', 'Jobs', 'For Sale', 'Community', 'Events'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-70 bg-[#2D1609] text-amber-100 px-4 py-2.5 rounded-xl shadow-2xl border border-amber-500/40 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DFD3] shadow-2xs px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToKiosk}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Back to Digital Corkboard Kiosk"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Board</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#FAF3EC] text-[#784A2F] border border-[#ECDDCF]">
                Screen: {targetBoard.id}
              </span>
              <span className="text-xs text-stone-500 hidden md:inline">
                ● {targetStore.name} ({targetStore.city}, {targetStore.state})
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[#1C120C] leading-tight">
              Community Flyer Listings & Advertiser Portal
            </h1>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {onBackToAdmin && (
            <button
              onClick={onBackToAdmin}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF5EE] hover:bg-[#F3E8DC] text-[#8C5D3D] border border-[#E8DCCD] transition-colors cursor-pointer"
            >
              Super Admin
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('create');
              setStep('form');
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#8B4513] hover:bg-[#72370E] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Flyer</span>
          </button>
        </div>
      </header>

      {/* Main Container - Expansive Wide Screen Layout */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6">
        {/* Screen Hardware Profile Card */}
        <div className="bg-gradient-to-r from-[#2C1E17] to-[#4A2F1F] text-white p-5 rounded-3xl shadow-md border border-[#3E2D23] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live In-Store Broadcast
              </span>
              <span className="text-xs text-stone-300 font-mono">
                {targetBoard.screenDiagonal} · 4K Resolution
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100">
              {targetStore.name} Commercial Bulletin Board
            </h2>
            <p className="text-xs text-stone-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{targetBoard.locationInStore} — {targetStore.address}, {targetStore.city}, {targetStore.state}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="text-right text-xs">
              <span className="text-[10px] text-amber-200 block font-medium">Daily Impressions</span>
              <span className="text-base font-bold text-white font-mono">
                {targetBoard.dailyImpressions.toLocaleString()} views
              </span>
            </div>
            <button
              onClick={onViewLiveBoard || onBackToKiosk}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#2C1E17] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Kiosk</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: 1. User List of Flyers vs 2. Add Simple & Quick Listing */}
        <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-[#EBE2D5] p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'list'
                  ? 'bg-[#583925] text-white font-bold shadow-xs'
                  : 'text-[#685549] hover:text-stone-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>All Active Screen Flyers ({screenListings.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                setStep('form');
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-[#583925] text-white font-bold shadow-xs'
                  : 'text-[#685549] hover:text-stone-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Simple & Quick Listing</span>
            </button>
          </div>

          <div className="text-xs text-stone-500">
            65% of all ad fees paid are disbursed directly to host cultural grocers.
          </div>
        </div>

        {/* =========================================================================
            TAB 1: USER LIST (ALL ACTIVE FLYERS ON THIS SCREEN)
           ========================================================================= */}
        {activeTab === 'list' && (
          <div className="space-y-4 animate-fade-in">
            {/* Search and Category Filter Toolbar */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search flyers by keyword or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[#583925] text-white font-bold shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* User List Grid - Responsive 5 Columns on Ultra Wide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4.5">
              {filteredListings.map((item) => {
                const img = getDisplayImage(item);
                const isItemFeatured = item.gridSize === '2x2';
                const isWide = item.gridSize === '2x1';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail with Slot Format Badge */}
                      <div className="relative h-32 bg-stone-100 overflow-hidden">
                        <img
                          src={img}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs">
                            {item.category}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#8B4513] text-white">
                            {item.gridSize || '1×1'}
                          </span>
                        </div>

                        {item.priceOrRate && (
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 text-stone-900 font-mono shadow-xs">
                              {item.priceOrRate}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-1.5">
                        <h3 className="font-bold text-xs text-stone-900 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-stone-500 line-clamp-2">
                          {item.details}
                        </p>
                        <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                          <span>Tel: {item.phone}</span>
                          <span className="text-emerald-700 font-semibold">● Active Rotation</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                      <span className="text-[10px] text-stone-400">
                        {item.durationDays ? `${item.durationDays} Days Listed` : '7 Days Rotation'}
                      </span>

                      <button
                        onClick={onViewLiveBoard || onBackToKiosk}
                        className="text-[#8B4513] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ADD SIMPLE & QUICK LISTING -> MULTI-STORE PREFERENCES -> CHECKOUT
           ========================================================================= */}
        {activeTab === 'create' && (
          <div className="space-y-6 animate-fade-in">
            {/* Step Progress Tracker */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between max-w-2xl mx-auto text-xs">
              <div className={`flex items-center gap-2 ${step === 'form' ? 'font-bold text-[#8B4513]' : 'text-stone-500'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step === 'form' ? 'bg-[#8B4513] text-white' : 'bg-stone-200'}`}>
                  1
                </span>
                <span>Ad Details & Stores</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
              <div className={`flex items-center gap-2 ${step === 'checkout' ? 'font-bold text-[#8B4513]' : 'text-stone-500'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step === 'checkout' ? 'bg-[#8B4513] text-white' : 'bg-stone-200'}`}>
                  2
                </span>
                <span>Quick Checkout</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
              <div className={`flex items-center gap-2 ${step === 'activating' || step === 'confirmed' ? 'font-bold text-emerald-700' : 'text-stone-500'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${step === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-stone-200'}`}>
                  3
                </span>
                <span>SuperAdmin Activation</span>
              </div>
            </div>

            {/* STEP 1: FORM WITH MULTI-STORE PREFERENCES & DURATION */}
            {step === 'form' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Form Inputs (7 Cols on Wide Screens) */}
                <div className="xl:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Origin Screen: {targetBoard.id}
                      </span>
                      <span className="text-xs text-stone-500">
                        Host Grocer: <strong>{targetStore.name}</strong>
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">
                      Post Quick Community Ad to Cultural Markets
                    </h3>
                    <p className="text-stone-500 text-xs mt-0.5">
                      Broadcast your flyer on 4K digital corkboards across your chosen host store locations.
                    </p>
                  </div>

                  <form onSubmit={handleProceedToCheckout} className="space-y-5">
                    {/* 1. Ad Title */}
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Flyer Title / Headline:
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Authentic Injera & Cultural Catering / 2BR Apartment For Rent"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* 2. Category & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Category:
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-semibold focus:bg-white focus:outline-none"
                        >
                          <option value="Services">Services & Trade</option>
                          <option value="Housing">Housing & Rentals</option>
                          <option value="Jobs">Jobs & Hiring</option>
                          <option value="For Sale">For Sale / Marketplace</option>
                          <option value="Community">Community Notice</option>
                          <option value="Events">Events & Festivals</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Price, Rate or Fee:
                        </label>
                        <input
                          type="text"
                          required
                          value={priceOrRate}
                          onChange={(e) => setPriceOrRate(e.target.value)}
                          placeholder="e.g. $25/hr, $1,450/mo, or Free"
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold text-amber-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 3. Contact Phone */}
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Contact Phone / WhatsApp:
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(702) 555-0199"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono font-bold focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* 4. PER-TILE SIZE SELECTION (1×1, 2×1, 2×2 TILES) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-stone-800 font-bold">
                          Display Slot Format (Tile Size):
                        </label>
                        <span className="text-[11px] text-stone-500 font-medium">
                          Choose grid dimensions
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Option 1: 1×1 Standard Tile */}
                        <button
                          type="button"
                          onClick={() => setGridSize('1x1')}
                          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                            gridSize === '1x1'
                              ? 'border-[#8B4513] bg-[#FAF5EE] ring-2 ring-amber-300/60 shadow-xs'
                              : 'border-stone-200 bg-stone-50 hover:border-amber-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-stone-900">1×1 Standard</span>
                              <span className="w-5 h-5 rounded-md border border-stone-400 bg-amber-100 flex items-center justify-center text-[9px] font-mono font-bold text-stone-700">
                                1×1
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500 block mt-1">
                              1 Col × 1 Row (Square)
                            </span>
                            <p className="text-[10px] text-stone-600 mt-1 line-clamp-2">
                              Standard corkboard flyer tile for jobs, services & rentals.
                            </p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between">
                            <span className="font-mono font-bold text-[#8B4513] text-xs">$2.00 / day</span>
                            <span className="text-[10px] text-stone-400">per store</span>
                          </div>
                        </button>

                        {/* Option 2: 2×1 Wide Banner Tile */}
                        <button
                          type="button"
                          onClick={() => setGridSize('2x1')}
                          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                            gridSize === '2x1'
                              ? 'border-[#8B4513] bg-[#FAF5EE] ring-2 ring-amber-300/60 shadow-xs'
                              : 'border-stone-200 bg-stone-50 hover:border-amber-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-stone-900">2×1 Wide Banner</span>
                              <span className="w-8 h-4 rounded-md border border-stone-400 bg-amber-100 flex items-center justify-center text-[9px] font-mono font-bold text-stone-700">
                                2×1
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500 block mt-1">
                              2 Cols × 1 Row (Landscape)
                            </span>
                            <p className="text-[10px] text-stone-600 mt-1 line-clamp-2">
                              Double width panoramic banner for high-visibility headlines.
                            </p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between">
                            <span className="font-mono font-bold text-[#8B4513] text-xs">$3.50 / day</span>
                            <span className="text-[10px] text-stone-400">per store</span>
                          </div>
                        </button>

                        {/* Option 3: 2×2 Featured Mega Poster */}
                        <button
                          type="button"
                          onClick={() => setGridSize('2x2')}
                          className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                            gridSize === '2x2'
                              ? 'border-[#8B4513] bg-[#FAF5EE] ring-2 ring-amber-300/60 shadow-xs'
                              : 'border-stone-200 bg-stone-50 hover:border-amber-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-stone-900">2×2 Mega Poster</span>
                              <span className="w-6 h-6 rounded-md border border-stone-400 bg-amber-200 flex items-center justify-center text-[9px] font-mono font-bold text-[#583925]">
                                2×2
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500 block mt-1">
                              2 Cols × 2 Rows (Featured)
                            </span>
                            <p className="text-[10px] text-stone-600 mt-1 line-clamp-2">
                              Prime top-left spotlight billboard with maximum visual footprint.
                            </p>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between">
                            <span className="font-mono font-bold text-[#8B4513] text-xs">$6.00 / day</span>
                            <span className="text-[10px] text-stone-400">per store</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* 5. MINIMUM / MAXIMUM DAYS LISTED (3 TO 90 DAYS) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-stone-800 font-bold">
                          Campaign Duration (Minimum 3 Days · Maximum 90 Days):
                        </label>
                        <span className="font-mono font-bold text-[#8B4513] bg-[#FAF3EC] px-2.5 py-0.5 rounded-lg border border-[#ECDDCF]">
                          {durationDays} Days Listed
                        </span>
                      </div>

                      {/* Duration Preset Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs mb-2.5">
                        {[
                          { days: 3, label: '3 Days (Flash)' },
                          { days: 7, label: '7 Days (1 Wk)' },
                          { days: 14, label: '14 Days (10% Off)' },
                          { days: 30, label: '30 Days (15% Off)' },
                          { days: 60, label: '60 Days (20% Off)' },
                          { days: 90, label: '90 Days (Max)' },
                        ].map((d) => (
                          <button
                            type="button"
                            key={d.days}
                            onClick={() => setDurationDays(d.days)}
                            className={`px-2.5 py-1 rounded-xl font-medium whitespace-nowrap cursor-pointer transition-colors ${
                              durationDays === d.days
                                ? 'bg-[#583925] text-white font-bold shadow-xs'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>

                      {/* Interactive Slider */}
                      <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-500">3 Days</span>
                        <input
                          type="range"
                          min={3}
                          max={90}
                          value={durationDays}
                          onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                          className="flex-1 accent-[#8B4513] cursor-pointer"
                        />
                        <span className="text-[10px] font-bold text-stone-500">90 Days</span>
                      </div>
                    </div>

                    {/* 6. MULTIPLE STORE PREFERENCES SELECTION */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                        <div>
                          <label className="block text-stone-800 font-bold">
                            Choose Store Preferences (Broadcast Locations):
                          </label>
                          <span className="text-[11px] text-stone-500 block">
                            Origin store is selected by default and enforced. Select multiple stores to expand reach.
                          </span>
                        </div>

                        {/* Quick Selection Shortcuts */}
                        <div className="flex items-center gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={selectOriginStoreOnly}
                            className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                          >
                            Origin Only (1)
                          </button>
                          <button
                            type="button"
                            onClick={selectLocalMetroStores}
                            className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold cursor-pointer border border-amber-200"
                          >
                            {targetStore.state} Metro
                          </button>
                          <button
                            type="button"
                            onClick={selectAllPartnerStores}
                            className="px-2 py-0.5 rounded bg-[#FAF3EC] hover:bg-[#F3E8DC] text-[#784A2F] font-semibold cursor-pointer border border-[#ECDDCF]"
                          >
                            All ({INITIAL_STORES.length})
                          </button>
                        </div>
                      </div>

                      {/* Store Cards List - Responsive 2 Columns on Desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1 border border-stone-200 rounded-2xl p-2.5 bg-stone-50/50">
                        {INITIAL_STORES.map((store) => {
                          const isOrigin = store.id === targetStore.id;
                          const isSelected = selectedStoreIds.includes(store.id);

                          return (
                            <div
                              key={store.id}
                              onClick={() => handleToggleStore(store.id)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isOrigin
                                  ? 'bg-[#FFF9F2] border-[#D4A276] ring-1 ring-[#D4A276]'
                                  : isSelected
                                  ? 'bg-amber-50/70 border-amber-400'
                                  : 'bg-white border-stone-200 hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                                    isSelected
                                      ? 'bg-[#8B4513] text-white'
                                      : 'border border-stone-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-xs text-stone-900 truncate">
                                      {store.name}
                                    </span>
                                    {isOrigin ? (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#8B4513] text-white flex items-center gap-0.5">
                                        <Lock className="w-2.5 h-2.5" />
                                        <span>Origin Host (Enforced)</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-stone-400">
                                        {store.city}, {store.state}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-stone-500 block truncate">
                                    {store.address} · {store.screenCount} Commercial 4K Screen(s)
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-mono text-emerald-700 font-semibold block">
                                  +65% Host Share
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Store summary badge */}
                      <div className="mt-2 text-[11px] text-stone-600 flex items-center justify-between bg-white p-2 rounded-xl border border-stone-200">
                        <span>Selected Broadcast Locations:</span>
                        <span className="font-bold text-stone-900">
                          {selectedStoreIds.length} of {INITIAL_STORES.length} Cultural Markets
                        </span>
                      </div>
                    </div>

                    {/* 7. Flyer Pitch / Details */}
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Flyer Details / Pitch:
                      </label>
                      <textarea
                        rows={2}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Describe your offer, availability, qualifications, or special discounts for local community members..."
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* 8. Photo Visual Picker */}
                    <div>
                      <label className="block text-stone-700 font-bold mb-1.5 flex items-center justify-between">
                        <span>Select Flyer Visual Photo:</span>
                        <span className="text-[10px] text-stone-400">Click preset or paste custom URL</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {PRESET_COMMUNITY_IMAGES.map((preset) => (
                          <button
                            type="button"
                            key={preset.label}
                            onClick={() => {
                              setSelectedImageUrl(preset.url);
                              setCustomImageUrl('');
                            }}
                            className={`p-1 rounded-xl border-2 overflow-hidden text-left transition-all cursor-pointer relative group ${
                              activePhoto === preset.url
                                ? 'border-[#8B4513] ring-2 ring-amber-300'
                                : 'border-stone-200 hover:border-amber-400'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-11 object-cover rounded-lg"
                            />
                            <span className="block truncate text-[9px] font-semibold text-stone-700 mt-1">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-2">
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="Or paste custom image URL (https://...)"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 text-xs focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 9. REAL-TIME PRICE ESTIMATE & CONTINUE BUTTON */}
                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE5DA] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600">Calculated Cost Breakdown:</span>
                        <span className="font-mono text-stone-500">
                          ${baseDailyRate.toFixed(2)}/d × {durationDays}d × {storeCount} store{storeCount > 1 ? 's' : ''}
                        </span>
                      </div>

                      {totalDiscountAmount > 0 && (
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
                          <span>Volume Savings ({Math.round(totalDiscountPct * 100)}% off):</span>
                          <span className="font-mono font-bold">-${totalDiscountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-stone-500 block">Total Campaign Price</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            Includes 65% Direct Grocer Payout (${grocerShareTotal.toFixed(2)})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-xl text-[#8B4513]">
                          ${finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#8B4513] hover:bg-[#72370E] active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                      >
                        <span>Continue to Quick Checkout (${finalPrice.toFixed(2)})</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Ad Tile Preview (5 Cols on Wide Screens) */}
                <div className="xl:col-span-5 space-y-4">
                  <div className="bg-[#FAF6F0] p-5 rounded-3xl border border-[#D4A276]/60 sticky top-24 shadow-2xs">
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-2.5 text-center">
                      Live Corkboard Tile Preview ({gridSize.toUpperCase()})
                    </span>

                    {/* DYNAMIC CARD ACCORDING TO GRID SIZE */}
                    <div
                      className={`mx-auto bg-white rounded-2xl border-2 border-[#D4A276] shadow-md overflow-visible relative pt-2 ${
                        gridSize === '2x1' ? 'max-w-md' : 'max-w-xs'
                      }`}
                    >
                      {/* Unclipped Circular Pin Head with Metallic Highlight */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFF0DE] via-[#D4A276] to-[#7B4B1C] border border-[#502808] shadow-md flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-white/95" />
                        </div>
                      </div>

                      {/* 2×1 Wide Banner Layout vs 1×1 / 2×2 Layout */}
                      {gridSize === '2x1' ? (
                        <div className="flex flex-col sm:flex-row items-center overflow-hidden rounded-xl">
                          <div className="relative w-full sm:w-5/12 h-28 bg-stone-100 overflow-hidden shrink-0">
                            <img
                              src={activePhoto}
                              alt="Ad preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-[#583101]/90 text-amber-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              {category}
                            </div>
                          </div>
                          <div className="p-3 w-full sm:w-7/12 space-y-1">
                            <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                              {title || 'Your Wide Flyer Headline'}
                            </h4>
                            <p className="text-[10px] text-stone-500 line-clamp-2">
                              {details || 'Wide panoramic banner layout broadcasting across screens.'}
                            </p>
                            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100 font-mono">
                              <span className="font-bold text-emerald-700 text-xs">{priceOrRate || '$25/hr'}</span>
                              <span className="text-[10px] text-stone-600">{phone || '(702) 555-0199'}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Photo */}
                          <div
                            className={`relative bg-stone-100 overflow-hidden rounded-t-xl ${
                              gridSize === '2x2' ? 'aspect-4/3' : 'aspect-16/10'
                            }`}
                          >
                            <img
                              src={activePhoto}
                              alt="Ad preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-[#583101]/90 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                              {category}
                            </div>
                            <div className="absolute bottom-2 left-2 bg-white/95 text-stone-900 font-mono font-bold text-xs px-2 py-0.5 rounded shadow-xs">
                              {priceOrRate || '$25/hr'}
                            </div>
                            {gridSize === '2x2' && (
                              <div className="absolute top-2 right-2 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                                ★ Featured
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-3.5 space-y-1.5">
                            <h4 className="font-bold text-xs text-stone-900 line-clamp-2">
                              {title || 'Your Flyer Headline Appears Here'}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-2">
                              {details || 'Your ad pitch and description will be displayed clearly to thousands of shoppers every day.'}
                            </p>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                              <span className="font-mono text-stone-700 text-[11px]">
                                {phone || '(702) 555-0199'}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Verified
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Preview Diagnostics & Multi-Store Info */}
                    <div className="mt-4 p-3.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
                      <div className="flex items-center justify-between font-semibold text-stone-800">
                        <span>Slot Size:</span>
                        <span className="font-mono font-bold text-[#8B4513]">{gridSize} ({tileConfig.badge})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Campaign Length:</span>
                        <span className="font-bold text-stone-900">{durationDays} Days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Store Broadcasts:</span>
                        <span className="font-bold text-emerald-700">
                          {selectedStoreIds.length} Store{selectedStoreIds.length > 1 ? 's' : ''} Selected
                        </span>
                      </div>
                      <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-500">
                        ✓ Enforces default selection for origin host screen ({targetStore.name}).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: QUICK CHECKOUT WITH ITEMIZED STORE & TILE BREAKDOWN */}
            {step === 'checkout' && createdItem && (
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4A276] shadow-xl space-y-5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#8B4513] flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        Quick Checkout & Multi-Store Settlement
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Digital settlement with automated 65% host grocers revenue distribution.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('form')}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer underline"
                  >
                    Edit Ad & Stores
                  </button>
                </div>

                {/* Itemized summary */}
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#D4A276]/70 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-stone-900 block">
                        {createdItem.title}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {tileConfig.label} · {durationDays} Days Duration · {selectedStoreIds.length} Store(s)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-lg text-[#8B4513]">
                      ${finalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Calculation Details */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] space-y-1.5 font-mono text-stone-700">
                    <div className="flex justify-between">
                      <span>Base Tile Rate:</span>
                      <span>${baseDailyRate.toFixed(2)} / day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration Multiplier:</span>
                      <span>{durationDays} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stores Multiplier:</span>
                      <span>{selectedStoreIds.length} Location(s)</span>
                    </div>
                    <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-100">
                      <span>Subtotal:</span>
                      <span>${rawSubtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Discounts Applied ({Math.round(totalDiscountPct * 100)}%):</span>
                        <span>-${totalDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Selected Stores List */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1">
                      Broadcasting Across {selectedStoreIds.length} Host Cultural Market(s):
                    </span>
                    <div className="space-y-1">
                      {selectedStoreIds.map((id) => {
                        const st = INITIAL_STORES.find((s) => s.id === id);
                        const isOrigin = id === targetStore.id;
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between text-[11px] bg-white px-2.5 py-1 rounded-lg border border-stone-200"
                          >
                            <span className="font-medium text-stone-800">
                              {st?.name || id} {isOrigin && '(Host Origin)'}
                            </span>
                            <span className="text-emerald-700 font-mono text-[10px]">
                              65% payout: +${grocerSharePerStore.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 65% Revenue Split */}
                  <div className="pt-2 border-t border-stone-200 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>✓ 65% Direct Share to Host Grocers:</span>
                      <span className="font-mono font-bold">
                        ${grocerShareTotal.toFixed(2)} (${grocerSharePerStore.toFixed(2)} / store)
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Network Operations & Hardware OTA Sync (35%):</span>
                      <span className="font-mono">
                        ${platformShare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant 1-Click Pay Presets */}
                <div className="space-y-3">
                  <span className="text-stone-700 font-bold block text-xs">
                    Select Instant Payment Method:
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      className="p-3 rounded-xl border-2 border-[#8B4513] bg-amber-50/50 flex items-center justify-center gap-2 font-bold text-xs text-[#583101]"
                    >
                      <CreditCard className="w-4 h-4 text-[#8B4513]" />
                      <span>Demo Instant Pay</span>
                    </button>

                    <button
                      type="button"
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center gap-2 font-semibold text-xs text-stone-600"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Apple / Google Pay</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Zero wait time. Once payment executes, our SuperAdmin moderation pipeline automatically evaluates and activates your flyer onto the live in-store 4K screens in 1 second.
                  </p>
                </div>

                {/* Submit Checkout Button */}
                <div className="pt-2">
                  <button
                    onClick={handleExecuteCheckout}
                    className="w-full py-3.5 bg-gradient-to-r from-[#8B4513] to-[#583101] hover:from-[#72370E] hover:to-[#4A2600] active:scale-[0.99] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Pay ${finalPrice.toFixed(2)} & Instant Activate Ad</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: 1-SECOND SUPERADMIN CHECK & ACTIVATION */}
            {step === 'activating' && (
              <div className="max-w-md mx-auto bg-white p-7 rounded-3xl border-2 border-amber-500 shadow-2xl text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center mx-auto text-[#8B4513] shadow-inner">
                  <ShieldCheck className="w-8 h-8 animate-pulse text-[#8B4513]" />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    SuperAdmin Instant Security & Safety Check
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Evaluating community guidelines and syncing OTA display payload to Screen {targetBoard.id} and {selectedStoreIds.length} store locations...
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 transition-all duration-75"
                    style={{ width: `${Math.min(100, ((1000 - countdownMs) / 1000) * 100)}%` }}
                  />
                </div>

                <div className="font-mono text-xs font-bold text-amber-800">
                  SuperAdmin Verification Time: {(countdownMs / 1000).toFixed(2)}s remaining
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION OF SUCCESSFUL LISTING & INSTANT VIEW */}
            {step === 'confirmed' && createdItem && (
              <div className="max-w-2xl mx-auto bg-[#FFFDF9] p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl space-y-6 animate-fade-in text-xs">
                {/* Header Success Badge */}
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">
                    Listing Successfully Activated!
                  </h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    SuperAdmin has checked and approved your flyer. It is now broadcasting live on {selectedStoreIds.length} cultural market screen(s) for {durationDays} days.
                  </p>
                </div>

                {/* Order Confirmation Card */}
                <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-xs text-stone-800">
                      #CB-{targetBoard.id}-{Date.now().toString().slice(-4)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={createdItem.imageUrl}
                      alt={createdItem.title}
                      className="w-16 h-12 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-xs text-stone-900 block truncate">
                        {createdItem.title}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold block">
                        ● Live on 4K Displays ({createdItem.gridSize || '1×1'} Slot)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-stone-400 block">Host Markets:</span>
                      <span className="font-semibold text-stone-800">
                        {selectedStoreIds.length} Stores ({targetStore.name} + {Math.max(0, selectedStoreIds.length - 1)} more)
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Duration:</span>
                      <span className="font-bold text-stone-800">{durationDays} Days Listed</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex justify-between text-[11px]">
                    <span className="text-stone-400">Total Paid:</span>
                    <span className="font-mono font-bold text-stone-900">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Next Step Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('list');
                      setStep('form');
                    }}
                    className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    View in Active Flyers List
                  </button>

                  <button
                    onClick={onViewLiveBoard || onBackToKiosk}
                    className="py-3 px-4 bg-[#8B4513] hover:bg-[#72370E] text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View on Live Kiosk Board</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
