import React, { useState } from 'react';
import {
  Menu,
  X,
  Store,
  DollarSign,
  Tv,
  Tag,
  Settings,
  LogOut,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Smartphone,
  Copy,
  TrendingUp,
  Percent,
  ShoppingBag,
  AlertCircle,
  Wifi,
} from 'lucide-react';
import { type StorePartner, type BoardHardwareConfig, INITIAL_BOARDS } from '../../data/boardsData';
import { type StoreSpecialItem, INITIAL_STORE_SPECIALS } from '../../data/storeSpecialsData';
import { SAMPLE_CORKBOARD_LISTINGS, type ListingCardItem, getDisplayImage } from '../../data/findingsData';
import { type BoardDisplayConfig } from '../kiosk/DigitalCorkboardKiosk';
import { PinDetailModal } from '../kiosk/PinDetailModal';

interface StoreDashboardProps {
  store: StorePartner;
  isSuperAdminPreview?: boolean;
  onExitToSuperAdmin?: () => void;
  onSignOut: () => void;
  onLaunchStoreBoard: (boardConfig: BoardDisplayConfig, slideInterval?: number) => void;
  onOpenCorkboardPreview: (boardConfig?: BoardDisplayConfig, slideInterval?: number) => void;
}

type StoreTab = 'overview' | 'specials' | 'screens' | 'listings' | 'account';

export const StoreDashboard: React.FC<StoreDashboardProps> = ({
  store,
  isSuperAdminPreview = false,
  onExitToSuperAdmin,
  onSignOut,
  onLaunchStoreBoard,
  onOpenCorkboardPreview,
}) => {
  // Mobile sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StoreTab>('overview');

  // Store editable state
  const [currentStore, setCurrentStore] = useState<StorePartner>(store);
  const [storeSpecials, setStoreSpecials] = useState<StoreSpecialItem[]>(() => {
    return INITIAL_STORE_SPECIALS.filter((s) => s.storeId === store.id || s.storeId === 'salam-lv');
  });

  // Account editing form state
  const [contactName, setContactName] = useState(store.contactName);
  const [contactPhone, setContactPhone] = useState(store.contactPhone);
  const [contactEmail, setContactEmail] = useState(store.contactEmail);
  const [payoutMethod, setPayoutMethod] = useState<'ach' | 'zelle' | 'check'>('ach');
  const [bankRouting, setBankRouting] = useState('021000021');
  const [bankAccount, setBankAccount] = useState('•••• •••• 8842');
  const [zellePhone, setZellePhone] = useState(store.contactPhone);

  // New Store Special form state
  const [isPostingSpecial, setIsPostingSpecial] = useState(false);
  const [specialTitle, setSpecialTitle] = useState('');
  const [specialBadge, setSpecialBadge] = useState('Daily Morning Batch');
  const [specialDepartment, setSpecialDepartment] = useState<StoreSpecialItem['department']>('Bakery & Injera');
  const [regularPrice, setRegularPrice] = useState('$5.50');
  const [specialPrice, setSpecialPrice] = useState('$4.25');
  const [specialDesc, setSpecialDesc] = useState('');
  const [specialValidUntil, setSpecialValidUntil] = useState('This Weekend');
  const [specialImageUrl, setSpecialImageUrl] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectedPin, setInspectedPin] = useState<ListingCardItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Connected screens for this store
  const storeScreens = INITIAL_BOARDS.filter(
    (b) => b.storeId === currentStore.id || (currentStore.id === 'salam-lv' && b.storeId === 'salam-lv')
  );

  // Community ads rotating at this store
  const storeListings = SAMPLE_CORKBOARD_LISTINGS.slice(0, 24);

  // Handle posting a new store special
  const handlePublishSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialTitle || !specialPrice) return;

    const newSpecial: StoreSpecialItem = {
      id: `special-${Date.now()}`,
      storeId: currentStore.id,
      title: specialTitle,
      badgeText: specialBadge || 'Store Deal',
      department: specialDepartment,
      regularPrice: regularPrice || undefined,
      specialPrice,
      description: specialDesc || 'Fresh daily special published directly by store management.',
      validUntil: specialValidUntil || 'While supplies last',
      imageUrl:
        specialImageUrl ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isLiveOnBoard: true,
      postedDate: 'Just now',
    };

    setStoreSpecials([newSpecial, ...storeSpecials]);
    setIsPostingSpecial(false);
    setSpecialTitle('');
    setSpecialDesc('');
    showToast(`✓ Published "${newSpecial.title}" to your in-store digital corkboard screens!`);
  };

  // Toggle live status of a special
  const handleToggleSpecialStatus = (id: string) => {
    setStoreSpecials((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = !s.isLiveOnBoard;
        showToast(next ? `Special "${s.title}" is now LIVE on board!` : `Special paused from board.`);
        return { ...s, isLiveOnBoard: next };
      })
    );
  };

  // Delete special
  const handleDeleteSpecial = (id: string) => {
    setStoreSpecials((prev) => prev.filter((s) => s.id !== id));
    showToast('Store special removed.');
  };

  // Handle saving account settings
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStore({
      ...currentStore,
      contactName,
      contactPhone,
      contactEmail,
    });
    showToast('✓ Store merchant account & payout preferences saved successfully!');
  };

  // Launch primary board
  const handleLaunchPrimaryBoard = (fullscreen = true) => {
    const primaryBoard = storeScreens[0] || {
      id: 'SM-LV-001',
      storeName: currentStore.name,
      storeAddress: `${currentStore.address}, ${currentStore.city}, ${currentStore.state}`,
      status: 'Online',
      screenDiagonal: '75" Commercial 4K TV',
      slideIntervalSec: 10,
    };

    const boardConfig: BoardDisplayConfig = {
      storeName: primaryBoard.storeName,
      storeAddress: primaryBoard.storeAddress,
      boardId: primaryBoard.id,
      status: primaryBoard.status,
      screenType: primaryBoard.screenDiagonal,
    };

    if (fullscreen) {
      onLaunchStoreBoard(boardConfig, primaryBoard.slideIntervalSec);
    } else {
      onOpenCorkboardPreview(boardConfig, primaryBoard.slideIntervalSec);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans selection:bg-amber-300 selection:text-amber-950 flex flex-col">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-80 bg-[#2D1609] text-amber-100 px-4 py-2.5 rounded-xl shadow-2xl border border-amber-500/40 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Super Admin Preview Banner (If previewed by super admin) */}
      {isSuperAdminPreview && (
        <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900 animate-pulse" />
            <span>Super Admin Preview Mode: Viewing as &quot;{currentStore.name}&quot;</span>
          </div>
          {onExitToSuperAdmin && (
            <button
              onClick={onExitToSuperAdmin}
              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
            >
              Exit to Super Admin
            </button>
          )}
        </div>
      )}

      {/* Mobile-First Header Bar with Hamburger Menu */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle Button for Sidebar Drawer */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300/80 transition-colors cursor-pointer focus:outline-none"
              aria-label="Open sidebar menu"
              title="Toggle sidebar menu"
            >
              <Menu className="w-5 h-5 text-stone-800" />
            </button>

            {/* Store Branding */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#5A2C0D] flex items-center justify-center text-white shadow-xs shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-base font-serif font-bold text-stone-900 leading-tight">
                    {currentStore.name}
                  </h1>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Host Grocer
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  {currentStore.city}, {currentStore.state} · {storeScreens.length} Active Screens
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Launch In-Store Corkboard Live View */}
            <button
              onClick={() => handleLaunchPrimaryBoard(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B4513] hover:bg-[#72370E] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Launch actual in-store TV bulletin board screen"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch In-Store Board</span>
              <span className="sm:hidden">Board</span>
            </button>

            {/* Mobile Sign Out */}
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Sign Out of Merchant Dashboard"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body with Responsive Sidebar Drawer */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex gap-6 relative">
        {/* =========================================================================
            RESPONSIVE SIDEBAR MENU (Off-canvas on mobile, sidebar on desktop)
           ========================================================================= */}
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden animate-fade-in"
          />
        )}

        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 w-72 bg-white lg:bg-transparent z-50 lg:z-auto shadow-2xl lg:shadow-none border-r lg:border-r-0 border-stone-200 p-4 lg:p-0 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-4">
            {/* Sidebar Mobile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 lg:hidden">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#8B4513]" />
                <span className="font-serif font-bold text-sm text-stone-900">
                  {currentStore.name}
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Store Profile Widget in Sidebar */}
            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF6F0] p-3.5 rounded-2xl border border-[#D4A276]/70 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#583101] text-amber-100 flex items-center justify-center font-bold text-sm">
                  {currentStore.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs text-stone-900 truncate">
                    {currentStore.name}
                  </h3>
                  <p className="text-[10px] text-stone-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                    <span>{currentStore.city}, {currentStore.state}</span>
                  </p>
                </div>
              </div>

              {/* Monthly Revenue Share summary */}
              <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 block">Host Share (65%):</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    ${currentStore.merchantPayoutAmount.toLocaleString()}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {currentStore.payoutStatus}
                </span>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#8B4513] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-amber-300" />
                  <span>Revenue & Earnings</span>
                </div>
                <span className="font-mono text-[10px] opacity-80">65%</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('specials');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'specials'
                    ? 'bg-[#8B4513] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Store Specials Publisher</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-stone-900">
                  {storeSpecials.filter((s) => s.isLiveOnBoard).length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('screens');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'screens'
                    ? 'bg-[#8B4513] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tv className="w-4 h-4 text-amber-300" />
                  <span>In-Store Screens</span>
                </div>
                <span className="font-mono text-[10px] opacity-80">{storeScreens.length} TV</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('listings');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'listings'
                    ? 'bg-[#8B4513] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-amber-300" />
                  <span>Community Board Ads</span>
                </div>
                <span className="font-mono text-[10px] opacity-80">{storeListings.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('account');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'account'
                    ? 'bg-[#8B4513] text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-amber-50 hover:text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-amber-300" />
                  <span>Manage Store Account</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <button
              onClick={() => handleLaunchPrimaryBoard(false)}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-[#8B4513] hover:from-amber-600 hover:to-[#72370E] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Preview Live Screen</span>
            </button>

            {isSuperAdminPreview && onExitToSuperAdmin ? (
              <button
                onClick={onExitToSuperAdmin}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Return to Super Admin</span>
              </button>
            ) : (
              <button
                onClick={onSignOut}
                className="w-full py-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Store</span>
              </button>
            )}
          </div>
        </aside>

        {/* =========================================================================
            MAIN DASHBOARD CONTENT AREA
           ========================================================================= */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* TAB 1: OVERVIEW & REVENUE BREAKDOWN */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-[#FAF6F0] via-[#FFFDF9] to-[#FAF6F0] p-5 rounded-3xl border border-[#D4A276] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold uppercase tracking-wider mb-1">
                    <span>Host Grocer Settlement & Performance</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-emerald-700 font-bold">October 2026</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    Revenue & Screen Earnings
                  </h2>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl">
                    As a verified host merchant, you receive a guaranteed 65% revenue share from all paid community ads, events, and job posts displayed on your in-store bulletin screens.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D4A276] shadow-xs flex flex-col items-center sm:items-end text-right shrink-0">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                    Next Payout Date
                  </span>
                  <span className="font-serif font-bold text-lg text-stone-900">November 1, 2026</span>
                  <span className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    Direct Deposit (ACH) Verified
                  </span>
                </div>
              </div>

              {/* Revenue Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Your 65% Share</span>
                    <Percent className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-700">
                    ${currentStore.merchantPayoutAmount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    65% of ${currentStore.totalMonthlyRevenue.toLocaleString()} gross
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Gross Ads Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#8B4513]" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-stone-900">
                    ${currentStore.totalMonthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    +24.5% month-over-month
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Active Community Ads</span>
                    <Tag className="w-4 h-4 text-[#8B4513]" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-stone-900">
                    {storeListings.length} Live
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Rotating across {storeScreens.length} screens
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Daily In-Store Views</span>
                    <Eye className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-stone-900">
                    8,420 / day
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Customer queue impressions
                  </div>
                </div>
              </div>

              {/* Payout History & Settlement Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-800" />
                    <span>Host Merchant Payout History</span>
                  </h3>
                  <span className="text-xs text-stone-500">65% Contracted Share</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider">
                        <th className="pb-2 font-bold">Billing Cycle</th>
                        <th className="pb-2 font-bold">Gross In-Store Ads</th>
                        <th className="pb-2 font-bold">Host Share (65%)</th>
                        <th className="pb-2 font-bold">Disbursement Method</th>
                        <th className="pb-2 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      <tr>
                        <td className="py-2.5 text-stone-900 font-bold">October 2026 (Current)</td>
                        <td className="py-2.5 font-mono">${currentStore.totalMonthlyRevenue.toLocaleString()}</td>
                        <td className="py-2.5 font-mono font-bold text-emerald-700">
                          ${currentStore.merchantPayoutAmount.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-stone-600">ACH Direct Deposit (••••8842)</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Processing Nov 1
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-stone-900 font-bold">September 2026</td>
                        <td className="py-2.5 font-mono">$6,760</td>
                        <td className="py-2.5 font-mono font-bold text-emerald-700">$4,394</td>
                        <td className="py-2.5 text-stone-600">ACH Direct Deposit (••••8842)</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Paid Oct 1
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-stone-900 font-bold">August 2026</td>
                        <td className="py-2.5 font-mono">$5,400</td>
                        <td className="py-2.5 font-mono font-bold text-emerald-700">$3,510</td>
                        <td className="py-2.5 text-stone-600">ACH Direct Deposit (••••8842)</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Paid Sep 1
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORE SPECIALS PUBLISHER */}
          {activeTab === 'specials' && (
            <div className="space-y-6">
              {/* Header with Post Button */}
              <div className="bg-gradient-to-r from-[#FAF6F0] to-[#FFFDF9] p-5 rounded-3xl border border-[#D4A276] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold uppercase tracking-wider mb-1">
                    <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                    <span>In-Store Specials Publisher</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    Publish Daily Deals to Bulletin Screens
                  </h2>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl">
                    Post your daily butcher specials, fresh injera morning batches, imported spices, and bakery deals directly to the digital corkboard screens inside your store.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsPostingSpecial(true)}
                    className="px-4 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Special</span>
                  </button>
                  <button
                    onClick={() => handleLaunchPrimaryBoard(false)}
                    className="px-3 py-2 bg-white border border-[#D4A276] hover:bg-amber-50 text-amber-950 rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Preview On Screen</span>
                  </button>
                </div>
              </div>

              {/* Post Special Form Modal / Inline Box */}
              {isPostingSpecial && (
                <div className="bg-white p-5 rounded-2xl border-2 border-amber-500 shadow-md animate-fade-in space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-600 fill-red-600" />
                      <h3 className="font-bold text-sm text-stone-900">
                        Create & Publish New In-Store Special
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsPostingSpecial(false)}
                      className="p-1 rounded text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handlePublishSpecial} className="space-y-4">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Special Title / Item Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={specialTitle}
                        onChange={(e) => setSpecialTitle(e.target.value)}
                        placeholder="e.g. Fresh Warm Teff Injera (3-Pack Daily Batch)"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Department:
                        </label>
                        <select
                          value={specialDepartment}
                          onChange={(e) => setSpecialDepartment(e.target.value as any)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-medium focus:bg-white focus:outline-none"
                        >
                          <option value="Bakery & Injera">Bakery & Injera</option>
                          <option value="Butchery & Meat">Butchery & Meat</option>
                          <option value="Spices & Grains">Spices & Grains</option>
                          <option value="Coffee & Tea">Coffee & Tea</option>
                          <option value="Deli & Prepared">Deli & Prepared</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Special Sale Price:
                        </label>
                        <input
                          type="text"
                          required
                          value={specialPrice}
                          onChange={(e) => setSpecialPrice(e.target.value)}
                          placeholder="e.g. $4.25 or $9.99/lb"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-bold text-amber-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Original Regular Price:
                        </label>
                        <input
                          type="text"
                          value={regularPrice}
                          onChange={(e) => setRegularPrice(e.target.value)}
                          placeholder="e.g. $5.50"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Ribbon / Badge Text:
                        </label>
                        <input
                          type="text"
                          value={specialBadge}
                          onChange={(e) => setSpecialBadge(e.target.value)}
                          placeholder="Daily Morning Batch, Weekend Special"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Valid Through / Expiration:
                        </label>
                        <input
                          type="text"
                          value={specialValidUntil}
                          onChange={(e) => setSpecialValidUntil(e.target.value)}
                          placeholder="e.g. This Sunday, Today Only"
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Description / Preparation Details:
                      </label>
                      <textarea
                        rows={2}
                        value={specialDesc}
                        onChange={(e) => setSpecialDesc(e.target.value)}
                        placeholder="100% pure teff baked fresh daily at 7 AM & 2 PM. Soft, spongy, and authentically sour."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Photo URL (Optional — auto stock image provided):
                      </label>
                      <input
                        type="url"
                        value={specialImageUrl}
                        onChange={(e) => setSpecialImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setIsPostingSpecial(false)}
                        className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#8B4513] hover:bg-[#72370E] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Publish to Screens</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Active Specials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storeSpecials.map((special) => (
                  <div
                    key={special.id}
                    className={`bg-white rounded-2xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all ${
                      special.isLiveOnBoard
                        ? 'border-[#D4A276]'
                        : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Photo banner */}
                      <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                        <img
                          src={special.imageUrl}
                          alt={special.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#583101] text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          {special.department}
                        </div>
                        <div className="absolute top-2 right-2 bg-amber-400 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                          <span>{special.badgeText}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-sm text-stone-900 leading-snug">
                          {special.title}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {special.description}
                        </p>
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="font-mono font-bold text-base text-[#8B4513]">
                            {special.specialPrice}
                          </span>
                          {special.regularPrice && (
                            <span className="text-xs text-stone-400 line-through">
                              {special.regularPrice}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-500 ml-auto">
                            Valid: {special.validUntil}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleToggleSpecialStatus(special.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                          special.isLiveOnBoard
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {special.isLiveOnBoard ? '● Live on Screens' : '○ Paused'}
                      </button>

                      <button
                        onClick={() => handleDeleteSpecial(special.id)}
                        className="text-stone-400 hover:text-red-600 text-xs font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IN-STORE SCREENS & HARDWARE */}
          {activeTab === 'screens' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    Your In-Store Bulletin Displays
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Commercial 4K TV displays installed at {currentStore.name}. Remotely monitored and synced by Community Board fleet operations.
                  </p>
                </div>

                <button
                  onClick={() => handleLaunchPrimaryBoard(true)}
                  className="px-4 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Tv className="w-4 h-4" />
                  <span>Open Full-Screen Kiosk</span>
                </button>
              </div>

              {/* Screens Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeScreens.map((screen) => (
                  <div
                    key={screen.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                              {screen.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {screen.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-stone-900 text-base mt-2">
                            {screen.locationInStore}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {screen.screenDiagonal} · 3840×2160 (16:9 Landscape)
                          </p>
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                          <Tv className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Rotation Speed:</span>
                          <span className="font-mono font-bold text-stone-800">
                            {screen.slideIntervalSec}s per slide
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Screen Uptime:</span>
                          <span className="font-bold text-emerald-700">
                            {screen.uptimePercent}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Local IP:</span>
                          <span className="font-mono text-stone-700">{screen.ipAddress}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Wi-Fi Signal:</span>
                          <span className="text-stone-700">{screen.wifiSignal.split(' ')[0]} (Good)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                      <span className="text-xs text-stone-500">
                        Installed {screen.installedDate}
                      </span>
                      <button
                        onClick={() => handleLaunchPrimaryBoard(false)}
                        className="px-3 py-1.5 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Preview Screen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMMUNITY ADVERTISEMENTS ROTATING IN STORE */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    Current Community Listings on Your Board
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Local community members and businesses paid to display these verified flyers on the screens at {currentStore.name}.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 block font-mono">
                    {storeListings.length} Approved Active Ads
                  </span>
                  <span className="text-[11px] text-stone-500">Generating host revenue</span>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {storeListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-stone-200 hover:border-amber-400 shadow-xs p-3.5 flex flex-col justify-between group transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold pb-2 border-b border-stone-100">
                        <span className="bg-[#583101] text-amber-100 px-2 py-0.5 rounded">
                          {listing.category}
                        </span>
                        <span className="font-mono text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                          {listing.priceOrRate}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 mt-2 line-clamp-1 group-hover:text-[#8B4513]">
                        {listing.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                        {listing.details}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-stone-500">
                        {listing.phone}
                      </span>
                      <button
                        onClick={() => setInspectedPin(listing)}
                        className="text-[#8B4513] hover:underline font-bold text-[11px] cursor-pointer"
                      >
                        Inspect Pin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MANAGE STORE ACCOUNT & PAYOUT SETTINGS */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Manage Store Account & Payout Settings
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Keep your store manager contacts, physical address, and monthly ACH/Zelle disbursement details up to date.
                </p>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-6">
                {/* Store Profile Information */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
                    <Building2 className="w-4 h-4 text-amber-800" />
                    <span>Store Partner Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Store Name:
                      </label>
                      <input
                        type="text"
                        disabled
                        value={currentStore.name}
                        className="w-full bg-stone-100 border border-stone-300 rounded-lg px-3 py-2 text-stone-700 font-bold cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Physical Store Address:
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`${currentStore.address}, ${currentStore.city}, ${currentStore.state} ${currentStore.zipCode}`}
                        className="w-full bg-stone-100 border border-stone-300 rounded-lg px-3 py-2 text-stone-700 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Manager Contact Name:
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Manager Direct Phone:
                      </label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Settlement Email:
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 65% Revenue Share Payout Method */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>Host Merchant Payout Method (65% Share)</span>
                  </h3>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('ach')}
                      className={`flex-1 py-2 rounded-xl text-center font-bold text-xs border transition-colors cursor-pointer ${
                        payoutMethod === 'ach'
                          ? 'bg-[#8B4513] text-white border-amber-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      ACH Direct Deposit (Bank)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('zelle')}
                      className={`flex-1 py-2 rounded-xl text-center font-bold text-xs border transition-colors cursor-pointer ${
                        payoutMethod === 'zelle'
                          ? 'bg-[#8B4513] text-white border-amber-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      Zelle Instant Merchant
                    </button>
                  </div>

                  {payoutMethod === 'ach' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Routing Number (9-Digits):
                        </label>
                        <input
                          type="text"
                          value={bankRouting}
                          onChange={(e) => setBankRouting(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Account Number:
                        </label>
                        <input
                          type="text"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Zelle Enrolled Phone or Email:
                      </label>
                      <input
                        type="text"
                        value={zellePhone}
                        onChange={(e) => setZellePhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#8B4513] hover:bg-[#72370E] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Account & Payout Details</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {inspectedPin && (
        <PinDetailModal
          item={inspectedPin}
          onClose={() => setInspectedPin(null)}
          storeName={currentStore.name}
        />
      )}
    </div>
  );
};
