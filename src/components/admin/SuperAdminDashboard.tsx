import React, { useState } from 'react';
import {
  Home,
  Store,
  FileText,
  CreditCard,
  Users,
  BarChart2,
  ShieldCheck,
  Headphones,
  Layers,
  Settings,
  Calendar,
  ChevronDown,
  DollarSign,
  Eye,
  ShoppingCart,
  Check,
  ChevronRight,
  TrendingUp,
  Globe,
  Database,
  Cloud,
  Wifi,
  Clock,
  Flag,
  MessageSquare,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Tv,
  MapPin,
  ExternalLink,
  Sliders,
  Copy,
  AlertTriangle,
  Tag,
  Sparkles,
  Power,
  Radio,
  CheckCircle2,
  XCircle,
  Menu,
  X,
} from 'lucide-react';
import {
  INITIAL_STORES,
  INITIAL_BOARDS,
  type StorePartner,
  type BoardHardwareConfig,
} from '../../data/boardsData';
import {
  SAMPLE_CORKBOARD_LISTINGS,
  type ListingCardItem,
  getDisplayImage,
} from '../../data/findingsData';
import { RegisterBoardModal } from './RegisterBoardModal';
import { AddStoreModal } from './AddStoreModal';
import { AddPinModal } from './AddPinModal';
import { PinDetailModal } from '../kiosk/PinDetailModal';
import { type BoardDisplayConfig } from '../kiosk/DigitalCorkboardKiosk';
import { MonetizationMatrixChart } from '../charts/MonetizationMatrixChart';
import { DataTableView } from '../DataTableView';
import { ExecutiveSummaryPanel } from '../ExecutiveSummaryPanel';

interface SuperAdminDashboardProps {
  onLaunchBoard: (boardConfig: BoardDisplayConfig, slideInterval?: number) => void;
  onOpenPreviewModal: (boardConfig?: BoardDisplayConfig, slideInterval?: number) => void;
  onPreviewStoreDashboard: (store: StorePartner) => void;
  onNavigateToStoreAuth?: () => void;
  onOpenManageList?: (boardId: string) => void;
  sharedPins?: ListingCardItem[];
}

export type SidebarNavKey =
  | 'overview'
  | 'stores'
  | 'revenue'
  | 'listings'
  | 'payments'
  | 'users'
  | 'analytics'
  | 'moderation'
  | 'support'
  | 'system'
  | 'settings';

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  onLaunchBoard,
  onOpenPreviewModal,
  onPreviewStoreDashboard,
  onNavigateToStoreAuth,
  onOpenManageList,
  sharedPins,
}) => {
  // Navigation active tab (default 'overview' to match exact uploaded design)
  const [activeNav, setActiveNav] = useState<SidebarNavKey>('overview');

  // Sidebar visibility: hidden by default, toggled via hamburger menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Timeframe selector for charts ('day' | 'month' | 'year')
  const [globalTimeframe, setGlobalTimeframe] = useState<'day' | 'month' | 'year'>('month');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'day' | 'month' | 'year'>('month');
  const [viewsTimeframe, setViewsTimeframe] = useState<'day' | 'month' | 'year'>('month');
  const [usersTimeframe, setUsersTimeframe] = useState<'day' | 'month' | 'year'>('month');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPinCategory, setSelectedPinCategory] = useState('All');

  // Fleet & Store State
  const [boards, setBoards] = useState<BoardHardwareConfig[]>(INITIAL_BOARDS);
  const [stores, setStores] = useState<StorePartner[]>(INITIAL_STORES);
  const [pins, setPins] = useState<ListingCardItem[]>(() => sharedPins || SAMPLE_CORKBOARD_LISTINGS);

  React.useEffect(() => {
    if (sharedPins) {
      setPins(sharedPins);
    }
  }, [sharedPins]);

  // Modals
  const [isRegisterBoardModalOpen, setIsRegisterBoardModalOpen] = useState(false);
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [isAddPinModalOpen, setIsAddPinModalOpen] = useState(false);
  const [inspectedPin, setInspectedPin] = useState<ListingCardItem | null>(null);

  // Diagnostics & Remote Push State
  const [syncingBoardId, setSyncingBoardId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Remote Push Synchronization
  const handleRemotePush = (boardId: string) => {
    setSyncingBoardId(boardId);
    showToast(`Sending OTA synchronization signal to ${boardId}...`);
    setTimeout(() => {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === boardId
            ? { ...b, lastSync: 'Just now', status: 'Online' as const }
            : b
        )
      );
      setSyncingBoardId(null);
      showToast(`✓ Board ${boardId} OTA payload synced successfully!`);
    }, 1200);
  };

  // Toggle Board Status
  const handleToggleStatus = (boardId: string) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? {
              ...b,
              status: b.status === 'Online' ? ('Standby' as const) : ('Online' as const),
            }
          : b
      )
    );
    showToast(`Board ${boardId} hardware status updated.`);
  };

  // Change Slide Interval for a Board
  const handleChangeSlideInterval = (boardId: string, interval: number) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, slideIntervalSec: interval } : b))
    );
    showToast(`Slide rotation set to ${interval}s for ${boardId}`);
  };

  // Launch board helper
  const launchBoardConfig = (board: BoardHardwareConfig, fullscreen = true) => {
    const displayConfig: BoardDisplayConfig = {
      storeName: board.storeName,
      storeAddress: board.storeAddress,
      boardId: board.id,
      status: board.status,
      screenType: board.screenDiagonal,
    };
    if (fullscreen) {
      onLaunchBoard(displayConfig, board.slideIntervalSec);
    } else {
      onOpenPreviewModal(displayConfig, board.slideIntervalSec);
    }
  };

  // Navigation menu definitions matching the exact screenshot
  const NAV_ITEMS: { key: SidebarNavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: 'Overview', icon: Home },
    { key: 'stores', label: 'Stores', icon: Store },
    { key: 'revenue', label: 'Revenue', icon: DollarSign },
    { key: 'listings', label: 'Listings', icon: FileText },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'analytics', label: 'Analytics', icon: BarChart2 },
    { key: 'moderation', label: 'Moderation', icon: ShieldCheck },
    { key: 'support', label: 'Support', icon: Headphones },
    { key: 'system', label: 'System', icon: Layers },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  // Data for Charts in Overview
  const revenueBars = [
    { label: 'Oct 1', value: 2.1 },
    { label: '', value: 2.8 },
    { label: '', value: 3.4 },
    { label: '', value: 4.8 },
    { label: 'Oct 5', value: 4.2 },
    { label: '', value: 3.9 },
    { label: '', value: 4.9 },
    { label: '', value: 4.4 },
    { label: 'Oct 10', value: 3.5 },
    { label: '', value: 4.6 },
    { label: '', value: 4.7 },
    { label: '', value: 4.5 },
    { label: 'Oct 15', value: 3.8 },
    { label: '', value: 4.9 },
    { label: '', value: 4.4 },
    { label: '', value: 5.4 },
    { label: 'Oct 20', value: 5.1 },
    { label: '', value: 5.2 },
    { label: '', value: 4.8 },
    { label: '', value: 5.6 },
    { label: 'Oct 25', value: 6.2 },
    { label: '', value: 6.0 },
    { label: '', value: 6.8 },
    { label: '', value: 7.9 },
    { label: '', value: 7.4 },
    { label: 'Oct 31', value: 7.2 },
  ];

  const userBars = [
    { label: 'Oct 1', value: 60 },
    { label: '', value: 45 },
    { label: '', value: 55 },
    { label: '', value: 70 },
    { label: 'Oct 5', value: 62 },
    { label: '', value: 85 },
    { label: '', value: 75 },
    { label: '', value: 98 },
    { label: 'Oct 10', value: 68 },
    { label: '', value: 80 },
    { label: '', value: 92 },
    { label: '', value: 78 },
    { label: 'Oct 15', value: 95 },
    { label: '', value: 72 },
    { label: '', value: 68 },
    { label: '', value: 82 },
    { label: 'Oct 20', value: 94 },
    { label: '', value: 86 },
    { label: '', value: 78 },
    { label: '', value: 92 },
    { label: 'Oct 25', value: 115 },
    { label: '', value: 104 },
    { label: '', value: 130 },
    { label: '', value: 145 },
    { label: '', value: 152 },
    { label: 'Oct 31', value: 185 },
  ];

  const viewPoints = [
    { x: 0, y: 15 },
    { x: 10, y: 22 },
    { x: 20, y: 25 },
    { x: 30, y: 29 },
    { x: 40, y: 35 },
    { x: 50, y: 32 },
    { x: 60, y: 40 },
    { x: 70, y: 38 },
    { x: 80, y: 44 },
    { x: 90, y: 45 },
    { x: 100, y: 58 },
  ];

  const viewsPath = viewPoints.reduce((acc, curr, idx) => {
    const yScaled = 100 - (curr.y / 60) * 85;
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${yScaled}`;
  }, '');

  const viewsAreaPath = `${viewsPath} L 100 100 L 0 100 Z`;

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex font-sans text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-70 bg-[#2D1609] text-amber-100 px-4 py-2.5 rounded-xl shadow-2xl border border-amber-500/40 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          RESPONSIVE SIDEBAR DRAWER (HIDDEN BY DEFAULT, SHOWN ON HAMBURGER CLICK)
         ========================================================================= */}
      {/* Dimmed backdrop when drawer is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-55 w-64 sm:w-72 bg-[#2C1E17] text-stone-200 flex flex-col justify-between py-6 px-4 border-r border-[#3E2D23] select-none shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo & Close Button */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-[#8B4513] border border-amber-300/40 flex items-center justify-center text-white shadow-md shrink-0">
                {/* Storefront graphic */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#FFF2E2" stroke="#8B4513" />
                  <path d="M3 9h18v4a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1-3-3V9z" fill="#F59E0B" stroke="#B45309" />
                  <path d="M9 22V14h6v8" fill="#78350F" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                  Community Board
                </h1>
                <p className="text-[11px] text-[#A69285] font-medium leading-tight">
                  Super Admin
                </p>
              </div>
            </div>

            {/* Close 'X' Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-[#3D291F] hover:bg-[#4E3528] text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Close Menu"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveNav(item.key);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4A3326] text-white shadow-xs font-bold'
                      : 'text-[#A89689] hover:bg-[#38271E] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#A89689]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Quick Controls */}
        <div className="pt-4 border-t border-[#3E2D23]/80 space-y-2">
          <button
            onClick={() => {
              const target = stores[0];
              if (target) onPreviewStoreDashboard(target);
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#3D291F] hover:bg-[#4E3528] text-amber-200 text-xs font-bold transition-colors cursor-pointer border border-amber-900/50"
            title="Preview Merchant Portal as Salam Market"
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Store Portal Preview</span>
          </button>

          <button
            onClick={() => {
              onOpenPreviewModal();
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#8B4513] hover:bg-[#72370E] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Launch live digital bulletin board on full screen"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Launch In-Store Board</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN DASHBOARD VIEWPORT (FULL WIDTH RESPONSIVE)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
        {/* Top Header Bar */}
        <header className="px-4 sm:px-7 pt-5 sm:pt-7 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Toggle Button (Visible by Default to Show Sidebar) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E8DFD3] text-[#4A3B32] hover:bg-[#FAF7F2] hover:border-[#8C5D3D] shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 group"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[#8C5D3D] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-[#4A3B32] hidden sm:inline">Menu</span>
            </button>

            <div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1C120C] tracking-tight">
                  Super Admin Dashboard
                </h1>
                {activeNav !== 'overview' && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBE2D5] text-[#583925]">
                    {activeNav}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#7D6E65] mt-0.5 font-medium">
                {activeNav === 'overview'
                  ? 'Community Board Platform Overview'
                  : activeNav === 'system'
                  ? 'Fleet Hardware Management & Over-the-Air Remote Controls'
                  : activeNav === 'stores'
                  ? 'Host Cultural Grocers & 65% Revenue Share Network'
                  : activeNav === 'listings'
                  ? 'Community Board Pin Moderation & Live Flyers'
                  : activeNav === 'analytics'
                  ? 'Monetization Matrix, Yield Analytics & Executive Findings'
                  : `Community Board ${activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} Management`}
              </p>
            </div>
          </div>

          {/* Header Controls: Quick Tabs + Date Picker + Timeframe Segmented Control */}
          <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
            {/* Quick switcher buttons */}
            <div className="hidden xl:flex items-center bg-[#EBE2D5] p-1 rounded-xl gap-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveNav('overview')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  activeNav === 'overview' ? 'bg-[#583925] text-white font-bold' : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveNav('system')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  activeNav === 'system' ? 'bg-[#583925] text-white font-bold' : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Fleet
              </button>
              <button
                onClick={() => setActiveNav('stores')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  activeNav === 'stores' ? 'bg-[#583925] text-white font-bold' : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Stores
              </button>
              <button
                onClick={() => setActiveNav('listings')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  activeNav === 'listings' ? 'bg-[#583925] text-white font-bold' : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Pins
              </button>
              <button
                onClick={() => setActiveNav('analytics')}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  activeNav === 'analytics' ? 'bg-[#583925] text-white font-bold' : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Date range picker button */}
            <div className="flex items-center gap-2 bg-white border border-[#E8DFD3] rounded-xl px-3.5 py-2 text-xs font-medium text-[#4A3B32] shadow-2xs cursor-pointer hover:border-amber-400 transition-colors">
              <Calendar className="w-4 h-4 text-[#8C5D3D]" />
              <span>Oct 1, 2026 – Oct 31, 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C5D3D] ml-1" />
            </div>

            {/* Segmented Control: Day | Month | Year */}
            <div className="bg-[#EBE2D5] p-1 rounded-xl flex items-center gap-0.5 text-xs">
              <button
                onClick={() => setGlobalTimeframe('day')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  globalTimeframe === 'day'
                    ? 'bg-[#583925] text-white font-bold shadow-xs'
                    : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setGlobalTimeframe('month')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  globalTimeframe === 'month'
                    ? 'bg-[#583925] text-white font-bold shadow-xs'
                    : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setGlobalTimeframe('year')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  globalTimeframe === 'year'
                    ? 'bg-[#583925] text-white font-bold shadow-xs'
                    : 'text-[#685549] hover:text-stone-900'
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-7 pb-10 space-y-5">
          {/* =====================================================================
              VIEW 1: OVERVIEW DASHBOARD (MATCHES ATTACHED SCREENSHOT EXACTLY)
             ===================================================================== */}
          {activeNav === 'overview' && (
            <>
              {/* ROW 1: 6 TOP KPI CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
                {/* Card 1: Total Revenue */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EC] border border-[#ECDDCF] flex items-center justify-center text-[#784A2F] shrink-0 font-bold text-base">
                    $
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-[#7D6E65] block truncate leading-tight">
                      Total Revenue
                    </span>
                    <span className="text-xl font-bold text-[#1C120C] block leading-tight mt-0.5">
                      $48,320
                    </span>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      <span className="text-emerald-700 font-bold flex items-center">
                        ↑ 22%
                      </span>
                      <span className="text-[#96887F] truncate">vs last 30 days</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Total Views */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EC] border border-[#ECDDCF] flex items-center justify-center text-[#784A2F] shrink-0">
                    <Eye className="w-5 h-5 text-[#784A2F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-[#7D6E65] block truncate leading-tight">
                      Total Views
                    </span>
                    <span className="text-xl font-bold text-[#1C120C] block leading-tight mt-0.5">
                      1,245,680
                    </span>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      <span className="text-emerald-700 font-bold flex items-center">
                        ↑ 28%
                      </span>
                      <span className="text-[#96887F] truncate">vs last 30 days</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Total Users */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EC] border border-[#ECDDCF] flex items-center justify-center text-[#784A2F] shrink-0">
                    <Users className="w-5 h-5 text-[#784A2F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-[#7D6E65] block truncate leading-tight">
                      Total Users
                    </span>
                    <span className="text-xl font-bold text-[#1C120C] block leading-tight mt-0.5">
                      28,490
                    </span>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      <span className="text-emerald-700 font-bold flex items-center">
                        ↑ 18%
                      </span>
                      <span className="text-[#96887F] truncate">vs last 30 days</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Total Stores */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EC] border border-[#ECDDCF] flex items-center justify-center text-[#784A2F] shrink-0">
                    <Store className="w-5 h-5 text-[#784A2F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-[#7D6E65] block truncate leading-tight">
                      Total Stores
                    </span>
                    <span className="text-xl font-bold text-[#1C120C] block leading-tight mt-0.5">
                      186
                    </span>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      <span className="text-emerald-700 font-bold flex items-center">
                        ↑ 12%
                      </span>
                      <span className="text-[#96887F] truncate">vs last 30 days</span>
                    </div>
                  </div>
                </div>

                {/* Card 5: Active Listings */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EC] border border-[#ECDDCF] flex items-center justify-center text-[#784A2F] shrink-0">
                    <FileText className="w-5 h-5 text-[#784A2F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-[#7D6E65] block truncate leading-tight">
                      Active Listings
                    </span>
                    <span className="text-xl font-bold text-[#1C120C] block leading-tight mt-0.5">
                      3,920
                    </span>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      <span className="text-emerald-700 font-bold flex items-center">
                        ↑ 24%
                      </span>
                      <span className="text-[#96887F] truncate">vs last 30 days</span>
                    </div>
                  </div>
                </div>

                {/* Card 6: Total Orders */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EC] border border-[#ECDDCF] flex items-center justify-center text-[#784A2F] shrink-0">
                    <ShoppingCart className="w-5 h-5 text-[#784A2F]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-[#7D6E65] block truncate leading-tight">
                      Total Orders
                    </span>
                    <span className="text-xl font-bold text-[#1C120C] block leading-tight mt-0.5">
                      2,184
                    </span>
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      <span className="text-emerald-700 font-bold flex items-center">
                        ↑ 26%
                      </span>
                      <span className="text-[#96887F] truncate">vs last 30 days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: 3 ANALYTICS CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Chart 1: Platform Revenue */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">Platform Revenue</h3>
                      <div className="bg-[#EBE2D5] p-0.5 rounded-lg flex items-center text-[10px]">
                        {(['day', 'month', 'year'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setRevenueTimeframe(t)}
                            className={`px-2 py-0.5 rounded capitalize font-medium cursor-pointer ${
                              revenueTimeframe === t
                                ? 'bg-[#583925] text-white font-bold'
                                : 'text-[#685549]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-[#1C120C]">$48,320</span>
                      <span className="text-emerald-700 font-bold text-xs flex items-center">
                        ↑ 22%
                      </span>
                      <span className="text-xs text-[#96887F]">vs last 30 days</span>
                    </div>
                  </div>

                  {/* Bar Chart SVG */}
                  <div className="relative pt-2">
                    <div className="flex items-end justify-between h-36 border-b border-[#E8DFD3] pb-1 px-1 gap-1">
                      {revenueBars.map((bar, i) => {
                        const heightPercent = (bar.value / 8) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                            <div className="absolute -top-6 bg-[#2C1E17] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-mono">
                              ${bar.value}k
                            </div>
                            <div
                              className="w-full bg-[#BF8256] hover:bg-[#9C5D33] rounded-t-xs transition-colors"
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between text-[10px] text-[#96887F] pt-1.5 px-0.5 font-medium">
                      <span>Oct 1</span>
                      <span>Oct 5</span>
                      <span>Oct 10</span>
                      <span>Oct 15</span>
                      <span>Oct 20</span>
                      <span>Oct 25</span>
                      <span>Oct 31</span>
                    </div>
                  </div>
                </div>

                {/* Chart 2: Platform Views */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">Platform Views</h3>
                      <div className="bg-[#EBE2D5] p-0.5 rounded-lg flex items-center text-[10px]">
                        {(['day', 'month', 'year'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setViewsTimeframe(t)}
                            className={`px-2 py-0.5 rounded capitalize font-medium cursor-pointer ${
                              viewsTimeframe === t
                                ? 'bg-[#583925] text-white font-bold'
                                : 'text-[#685549]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-[#1C120C]">1,245,680</span>
                      <span className="text-emerald-700 font-bold text-xs flex items-center">
                        ↑ 28%
                      </span>
                      <span className="text-xs text-[#96887F]">vs last 30 days</span>
                    </div>
                  </div>

                  {/* Area Line Chart SVG */}
                  <div className="relative pt-2">
                    <div className="h-36 w-full border-b border-[#E8DFD3] pb-1 relative">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8C5D3D" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#8C5D3D" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        <path d={viewsAreaPath} fill="url(#areaGradient)" />
                        <path
                          d={viewsPath}
                          fill="none"
                          stroke="#8C5D3D"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {viewPoints.map((pt, i) => {
                          const yScaled = 100 - (pt.y / 60) * 85;
                          return (
                            <circle
                              key={i}
                              cx={pt.x}
                              cy={yScaled}
                              r="2.5"
                              fill="#653B21"
                              stroke="#FFF"
                              strokeWidth="1.2"
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between text-[10px] text-[#96887F] pt-1.5 px-0.5 font-medium">
                      <span>Oct 1</span>
                      <span>Oct 5</span>
                      <span>Oct 10</span>
                      <span>Oct 15</span>
                      <span>Oct 20</span>
                      <span>Oct 25</span>
                      <span>Oct 31</span>
                    </div>
                  </div>
                </div>

                {/* Chart 3: New Users */}
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">New Users</h3>
                      <div className="bg-[#EBE2D5] p-0.5 rounded-lg flex items-center text-[10px]">
                        {(['day', 'month', 'year'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setUsersTimeframe(t)}
                            className={`px-2 py-0.5 rounded capitalize font-medium cursor-pointer ${
                              usersTimeframe === t
                                ? 'bg-[#583925] text-white font-bold'
                                : 'text-[#685549]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-[#1C120C]">2,480</span>
                      <span className="text-emerald-700 font-bold text-xs flex items-center">
                        ↑ 18%
                      </span>
                      <span className="text-xs text-[#96887F]">vs last 30 days</span>
                    </div>
                  </div>

                  {/* Bar Chart SVG */}
                  <div className="relative pt-2">
                    <div className="flex items-end justify-between h-36 border-b border-[#E8DFD3] pb-1 px-1 gap-1">
                      {userBars.map((bar, i) => {
                        const heightPercent = (bar.value / 200) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                            <div className="absolute -top-6 bg-[#2C1E17] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-mono">
                              {bar.value}
                            </div>
                            <div
                              className="w-full bg-[#BF8256] hover:bg-[#9C5D33] rounded-t-xs transition-colors"
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between text-[10px] text-[#96887F] pt-1.5 px-0.5 font-medium">
                      <span>Oct 1</span>
                      <span>Oct 5</span>
                      <span>Oct 10</span>
                      <span>Oct 15</span>
                      <span>Oct 20</span>
                      <span>Oct 25</span>
                      <span>Oct 31</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: TOP PERFORMING STORES, LISTINGS BY CATEGORY, STORE STATUS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
                {/* 1. Top Performing Stores (5 Cols on xl, full width on md) */}
                <div className="col-span-1 md:col-span-2 xl:col-span-5 bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">Top Performing Stores</h3>
                      <button
                        onClick={() => setActiveNav('stores')}
                        className="text-[11px] font-semibold text-[#8C5D3D] bg-[#FAF5EE] hover:bg-[#F3E8DC] border border-[#E8DCCD] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto mt-3">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#F0E8DD] text-[10px] font-semibold text-[#96887F]">
                            <th className="pb-2 w-6">#</th>
                            <th className="pb-2">Store Name</th>
                            <th className="pb-2">Revenue</th>
                            <th className="pb-2">Orders</th>
                            <th className="pb-2">Listings</th>
                            <th className="pb-2 text-right">Volume</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F7F2EC] text-[11px]">
                          {[
                            { rank: 1, name: 'Salam Market Las Vegas', rev: '$8,420', orders: 362, listings: 480, barW: '100%', storeId: 'salam-lv' },
                            { rank: 2, name: 'Habesha Market', rev: '$6,950', orders: 298, listings: 420, barW: '82%', storeId: 'habesha-la' },
                            { rank: 3, name: 'Selam Grocery', rev: '$5,870', orders: 256, listings: 310, barW: '69%', storeId: 'selam-sea' },
                            { rank: 4, name: 'Nile Market', rev: '$4,980', orders: 210, listings: 260, barW: '58%', storeId: 'salam-lv' },
                            { rank: 5, name: 'Ethio Fresh', rev: '$4,120', orders: 176, listings: 240, barW: '48%', storeId: 'habesha-la' },
                          ].map((row) => (
                            <tr key={row.rank} className="hover:bg-[#FAF6F1] transition-colors">
                              <td className="py-2.5 text-[#96887F] font-medium">{row.rank}</td>
                              <td className="py-2.5 font-medium text-[#1C120C]">
                                <button
                                  onClick={() => {
                                    const found = stores.find((s) => s.id === row.storeId) || stores[0];
                                    onPreviewStoreDashboard(found);
                                  }}
                                  className="hover:text-[#8B4513] hover:underline text-left cursor-pointer truncate max-w-[140px] block"
                                  title="Preview store dashboard"
                                >
                                  {row.name}
                                </button>
                              </td>
                              <td className="py-2.5 font-bold text-[#1C120C] font-mono">{row.rev}</td>
                              <td className="py-2.5 text-[#5D4E44]">{row.orders}</td>
                              <td className="py-2.5 text-[#5D4E44]">{row.listings}</td>
                              <td className="py-2.5 text-right w-20">
                                <div className="w-full bg-[#F3ECE3] h-2.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[#8B5634] h-full rounded-full"
                                    style={{ width: row.barW }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 2. Listings by Category Donut Chart (4 Cols on xl, 1 Col on md) */}
                <div className="col-span-1 md:col-span-1 xl:col-span-4 bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#1C120C]">Listings by Category</h3>

                    <div className="flex items-center justify-between gap-4 pt-3 flex-wrap sm:flex-nowrap">
                      {/* Donut SVG */}
                      <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center mx-auto sm:mx-0">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                          {/* Background track */}
                          <circle cx="50" cy="50" r="38" stroke="#F4ECE2" strokeWidth="15" fill="none" />

                          {/* Slices: Housing 28%, Jobs 22%, For Sale 18%, Services 15%, Community 10%, Events 7% */}
                          <circle
                            cx="50" cy="50" r="38"
                            stroke="#54331C" strokeWidth="15" fill="none"
                            strokeDasharray="66.85 238.76" strokeDashoffset="0"
                          />
                          <circle
                            cx="50" cy="50" r="38"
                            stroke="#7B492B" strokeWidth="15" fill="none"
                            strokeDasharray="52.52 238.76" strokeDashoffset="-66.85"
                          />
                          <circle
                            cx="50" cy="50" r="38"
                            stroke="#A86A43" strokeWidth="15" fill="none"
                            strokeDasharray="42.97 238.76" strokeDashoffset="-119.37"
                          />
                          <circle
                            cx="50" cy="50" r="38"
                            stroke="#CB8D64" strokeWidth="15" fill="none"
                            strokeDasharray="35.81 238.76" strokeDashoffset="-162.34"
                          />
                          <circle
                            cx="50" cy="50" r="38"
                            stroke="#D8AB8D" strokeWidth="15" fill="none"
                            strokeDasharray="23.87 238.76" strokeDashoffset="-198.15"
                          />
                          <circle
                            cx="50" cy="50" r="38"
                            stroke="#EED7C5" strokeWidth="15" fill="none"
                            strokeDasharray="16.71 238.76" strokeDashoffset="-222.02"
                          />
                        </svg>

                        {/* Donut Center Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-base font-bold text-[#1C120C] leading-none">3,920</span>
                          <span className="text-[9px] text-[#7D6E65] font-medium mt-0.5">Active Listings</span>
                        </div>
                      </div>

                      {/* Donut Legend */}
                      <div className="space-y-1.5 text-xs flex-1 w-full sm:w-auto">
                        {[
                          { label: 'Housing', pct: '28%', color: '#54331C' },
                          { label: 'Jobs', pct: '22%', color: '#7B492B' },
                          { label: 'For Sale', pct: '18%', color: '#A86A43' },
                          { label: 'Services', pct: '15%', color: '#CB8D64' },
                          { label: 'Community', pct: '10%', color: '#D8AB8D' },
                          { label: 'Events', pct: '7%', color: '#EED7C5' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-[#4A3B32]">{item.label}</span>
                            </div>
                            <span className="font-bold text-[#1C120C]">{item.pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Store Status Breakdown (3 Cols on xl, 1 Col on md) */}
                <div className="col-span-1 md:col-span-1 xl:col-span-3 bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">Store Status</h3>
                      <button
                        onClick={() => setActiveNav('stores')}
                        className="text-[11px] font-semibold text-[#8C5D3D] bg-[#FAF5EE] hover:bg-[#F3E8DC] border border-[#E8DCCD] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3 pt-3 text-xs">
                      {/* Active Stores */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                          <span>Active Stores</span>
                        </div>
                        <span className="font-bold text-[#1C120C] text-sm">142</span>
                      </div>

                      {/* Pending Approval */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                          <span>Pending Approval</span>
                        </div>
                        <span className="font-bold text-[#1C120C] text-sm">18</span>
                      </div>

                      {/* Paused Stores */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" />
                          <span>Paused Stores</span>
                        </div>
                        <span className="font-bold text-[#1C120C] text-sm">14</span>
                      </div>

                      {/* Suspended Stores */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
                          <span>Suspended Stores</span>
                        </div>
                        <span className="font-bold text-[#1C120C] text-sm">12</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Stores divider and footer */}
                  <div className="pt-3 border-t border-[#F0E8DD] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1C120C]">Total Stores</span>
                    <span className="font-bold text-base text-[#1C120C]">186</span>
                  </div>
                </div>
              </div>

              {/* ROW 4: RECENT PAYMENTS, MODERATION QUEUE, SYSTEM STATUS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
                {/* 1. Recent Payments Table (5 Cols on xl, full width on md) */}
                <div className="col-span-1 md:col-span-2 xl:col-span-5 bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">Recent Payments</h3>
                      <button
                        onClick={() => setActiveNav('payments')}
                        className="text-[11px] font-semibold text-[#8C5D3D] bg-[#FAF5EE] hover:bg-[#F3E8DC] border border-[#E8DCCD] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto mt-3">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#F0E8DD] text-[10px] font-semibold text-[#96887F]">
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Store</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2">Type</th>
                            <th className="pb-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F7F2EC] text-[11px]">
                          {[
                            { date: 'Oct 31, 2026', store: 'Salam Market Las Vegas', amount: '$120.00', type: 'Subscription', status: 'Paid' },
                            { date: 'Oct 31, 2026', store: 'Habesha Market', amount: '$85.00', type: 'Subscription', status: 'Paid' },
                            { date: 'Oct 30, 2026', store: 'Selam Grocery', amount: '$60.00', type: 'Subscription', status: 'Paid' },
                            { date: 'Oct 30, 2026', store: 'Nile Market', amount: '$120.00', type: 'Subscription', status: 'Paid' },
                            { date: 'Oct 29, 2026', store: 'Ethio Fresh', amount: '$40.00', type: 'Listing Upgrade', status: 'Paid' },
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-[#FAF6F1] transition-colors">
                              <td className="py-2.5 text-[#96887F] whitespace-nowrap">{row.date}</td>
                              <td className="py-2.5 font-medium text-[#1C120C] truncate max-w-[130px]">{row.store}</td>
                              <td className="py-2.5 font-bold text-[#1C120C] font-mono">{row.amount}</td>
                              <td className="py-2.5 text-[#786C64]">{row.type}</td>
                              <td className="py-2.5 text-right">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#15803D] border border-[#C6ECCF]">
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 2. Moderation Queue (4 Cols on xl, 1 Col on md) */}
                <div className="col-span-1 md:col-span-1 xl:col-span-4 bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">Moderation Queue</h3>
                      <button
                        onClick={() => setActiveNav('moderation')}
                        className="text-[11px] font-semibold text-[#8C5D3D] bg-[#FAF5EE] hover:bg-[#F3E8DC] border border-[#E8DCCD] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-2 pt-3 text-xs">
                      {/* Pending Listings */}
                      <div
                        onClick={() => setActiveNav('listings')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE3] border border-[#EDE5DA] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 text-[#4A3B32]">
                          <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#8C5D3D] shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-medium group-hover:text-stone-900">Pending Listings</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs bg-[#583925] text-white px-2 py-0.5 rounded-full font-mono">24</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#96887F] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Pending Store Approvals */}
                      <div
                        onClick={() => setActiveNav('stores')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE3] border border-[#EDE5DA] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 text-[#4A3B32]">
                          <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#8C5D3D] shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-medium group-hover:text-stone-900">Pending Store Approvals</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs bg-[#583925] text-white px-2 py-0.5 rounded-full font-mono">8</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#96887F] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Reported Content */}
                      <div
                        onClick={() => setActiveNav('moderation')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE3] border border-[#EDE5DA] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 text-[#4A3B32]">
                          <div className="w-7 h-7 rounded-lg bg-red-100/80 flex items-center justify-center text-red-700 shrink-0">
                            <Flag className="w-4 h-4" />
                          </div>
                          <span className="font-medium group-hover:text-stone-900">Reported Content</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs bg-red-700 text-white px-2 py-0.5 rounded-full font-mono">5</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#96887F] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* User Reports */}
                      <div
                        onClick={() => setActiveNav('moderation')}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE3] border border-[#EDE5DA] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 text-[#4A3B32]">
                          <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center text-[#8C5D3D] shrink-0">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <span className="font-medium group-hover:text-stone-900">User Reports</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs bg-[#583925] text-white px-2 py-0.5 rounded-full font-mono">3</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#96887F] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. System Status (3 Cols on xl, 1 Col on md) */}
                <div className="col-span-1 md:col-span-1 xl:col-span-3 bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C120C]">System Status</h3>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#15803D] bg-[#EAF7EE] border border-[#C6ECCF] px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                        <span>Online</span>
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-3 text-xs">
                      {/* Platform Status */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EDE5DA]">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <Globe className="w-4 h-4 text-[#8C5D3D]" />
                          <span>Platform Status</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#15803D] border border-[#C6ECCF]">
                          Operational
                        </span>
                      </div>

                      {/* Database */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EDE5DA]">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <Database className="w-4 h-4 text-[#8C5D3D]" />
                          <span>Database</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#15803D] border border-[#C6ECCF]">
                          Healthy
                        </span>
                      </div>

                      {/* Server Uptime */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EDE5DA]">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <Cloud className="w-4 h-4 text-[#8C5D3D]" />
                          <span>Server Uptime</span>
                        </div>
                        <span className="font-bold text-[#1C120C] font-mono">99.9%</span>
                      </div>

                      {/* CDN & Network */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EDE5DA]">
                        <div className="flex items-center gap-2 text-[#4A3B32]">
                          <Wifi className="w-4 h-4 text-[#8C5D3D]" />
                          <span>CDN & Network</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#15803D] border border-[#C6ECCF]">
                          Operational
                        </span>
                      </div>

                      {/* Last Update */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#F0E8DD] text-[11px]">
                        <div className="flex items-center gap-2 text-[#96887F]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Last Update</span>
                        </div>
                        <span className="text-[#5D4E44] font-medium">Oct 31, 2026 12:08 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =====================================================================
              VIEW 2: SYSTEM / HARDWARE FLEET COMMAND CENTER (PREVIOUS SUPER ADMIN)
             ===================================================================== */}
          {activeNav === 'system' && (
            <div className="space-y-6 animate-fade-in">
              {/* Fleet Summary Header Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs">
                  <div className="text-xs text-[#7D6E65] font-medium">Total Registered Displays</div>
                  <div className="text-2xl font-bold text-[#1C120C] mt-1 font-mono">218 Screens</div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-1">14 in Active Metro Cluster</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs">
                  <div className="text-xs text-[#7D6E65] font-medium">Fleet Hardware Health</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">99.9% Online</div>
                  <div className="text-[10px] text-[#96887F] mt-1">Low-latency WebSocket heartbeat</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs">
                  <div className="text-xs text-[#7D6E65] font-medium">Daily In-Store Impressions</div>
                  <div className="text-2xl font-bold text-[#1C120C] mt-1 font-mono">1,245,680</div>
                  <div className="text-[10px] text-[#96887F] mt-1">Average 5,714 views / screen / day</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs">
                  <div className="text-xs text-[#7D6E65] font-medium">OTA Broadcast Sync</div>
                  <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">Real-time Push</div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-1">✓ Instant Corkboard Sync</div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="bg-white rounded-2xl border border-[#EDE5DA] p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search screens by ID, store, or city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl focus:outline-hidden focus:border-[#8B4513]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-3 py-1.5 text-stone-700"
                  >
                    <option value="all">All Hardware Status</option>
                    <option value="Online">Online Only</option>
                    <option value="Standby">Standby / Paused</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenPreviewModal()}
                    className="px-3 py-2 bg-[#FAF5EE] hover:bg-[#F3E8DC] text-[#8C5D3D] border border-[#E8DCCD] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Preview Live Board</span>
                  </button>
                  <button
                    onClick={() => setIsRegisterBoardModalOpen(true)}
                    className="px-3.5 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register New Display</span>
                  </button>
                </div>
              </div>

              {/* Hardware Boards Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards
                  .filter((b) => {
                    const matchesSearch =
                      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      b.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      b.storeCity.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((board) => (
                    <div
                      key={board.id}
                      className="bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
                    >
                      {/* Top Header of Card */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-[#FAF3EC] text-[#784A2F] border border-[#ECDDCF]">
                                {board.id}
                              </span>
                              <button
                                onClick={() => copyToClipboard(board.id, board.id)}
                                className="text-stone-400 hover:text-stone-700 p-0.5"
                                title="Copy Board ID"
                              >
                                {copiedId === board.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <h3 className="font-bold text-sm text-[#1C120C] mt-2 leading-tight">
                              {board.storeName}
                            </h3>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#8C5D3D] shrink-0" />
                              <span className="truncate">{board.locationInStore}</span>
                            </p>
                          </div>

                          {/* Online / Standby Toggle */}
                          <button
                            onClick={() => handleToggleStatus(board.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              board.status === 'Online'
                                ? 'bg-[#EAF7EE] text-[#15803D] border border-[#C6ECCF]'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                board.status === 'Online' ? 'bg-[#22C55E] animate-pulse' : 'bg-amber-500'
                              }`}
                            />
                            <span>{board.status}</span>
                          </button>
                        </div>

                        {/* Specs Grid */}
                        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE5DA]">
                          <div>
                            <span className="text-stone-400 block text-[10px]">Display Type:</span>
                            <span className="font-semibold text-stone-800">{board.screenDiagonal}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">Resolution:</span>
                            <span className="font-mono text-stone-800">4K (3840×2160)</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">Uptime & Views:</span>
                            <span className="font-medium text-emerald-700">{board.uptimePercent}% ({board.dailyImpressions.toLocaleString()}/d)</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px]">IP / Firmware:</span>
                            <span className="font-mono text-stone-700 truncate block">{board.ipAddress}</span>
                          </div>
                        </div>

                        {/* Slide Interval Speed Control */}
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-stone-500 text-[11px] font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#8C5D3D]" />
                            <span>Rotation Speed:</span>
                          </span>
                          <div className="flex items-center gap-1 bg-[#EBE2D5] p-0.5 rounded-lg">
                            {[5, 10, 15, 30].map((interval) => (
                              <button
                                key={interval}
                                onClick={() => handleChangeSlideInterval(board.id, interval)}
                                className={`px-2 py-0.5 text-[10px] rounded font-semibold cursor-pointer transition-colors ${
                                  board.slideIntervalSec === interval
                                    ? 'bg-[#583925] text-white font-bold'
                                    : 'text-[#685549] hover:text-stone-900'
                                }`}
                              >
                                {interval}s
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-[#EDE5DA] flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => launchBoardConfig(board, true)}
                            className="px-2.5 py-1.5 bg-[#8B4513] hover:bg-[#72370E] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Launch Fullscreen Kiosk Mode"
                          >
                            <Tv className="w-3 h-3" />
                            <span>Launch</span>
                          </button>
                          <button
                            onClick={() => launchBoardConfig(board, false)}
                            className="px-2.5 py-1.5 bg-[#FAF5EE] hover:bg-[#F3E8DC] text-[#8C5D3D] text-[11px] font-semibold border border-[#E8DCCD] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Preview Modal"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                          {onOpenManageList && (
                            <button
                              onClick={() => onOpenManageList(board.id)}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-semibold border border-amber-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Manage Listings on this Screen"
                            >
                              <FileText className="w-3 h-3 text-amber-700" />
                              <span>Manage Screen</span>
                            </button>
                          )}
                        </div>

                        {/* OTA Sync Button */}
                        <button
                          onClick={() => handleRemotePush(board.id)}
                          disabled={syncingBoardId === board.id}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Over-The-Air Payload Sync"
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${syncingBoardId === board.id ? 'animate-spin text-amber-600' : ''}`}
                          />
                          <span>{syncingBoardId === board.id ? 'Syncing...' : 'OTA Sync'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 3: PARTNER STORES & 65% REVENUE SHARE (PREVIOUS SUPER ADMIN)
             ===================================================================== */}
          {activeNav === 'stores' && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Banner & KPI Chips */}
              <div className="bg-white rounded-3xl border border-[#EDE5DA] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#F0E8DD]">
                  <div>
                    <h3 className="text-xl font-bold text-[#1C120C]">Partner Stores & Host Grocers Network</h3>
                    <p className="text-xs text-[#7D6E65]">186 cultural markets earning 65% recurring monthly revenue share</p>
                  </div>
                  <button
                    onClick={() => setIsAddStoreModalOpen(true)}
                    className="px-3.5 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Partner Store</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE5DA]">
                    <span className="text-[10px] text-stone-500 font-medium block">Total Cultural Grocers</span>
                    <span className="text-xl font-bold text-stone-900 font-mono">186 Stores</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE5DA]">
                    <span className="text-[10px] text-stone-500 font-medium block">30-Day Platform Gross</span>
                    <span className="text-xl font-bold text-stone-900 font-mono">$48,320</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE5DA]">
                    <span className="text-[10px] text-stone-500 font-medium block">Merchant 65% Payouts</span>
                    <span className="text-xl font-bold text-emerald-700 font-mono">$31,408</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE5DA]">
                    <span className="text-[10px] text-stone-500 font-medium block">Average Monthly / Grocer</span>
                    <span className="text-xl font-bold text-[#8C5D3D] font-mono">$1,688 / mo</span>
                  </div>
                </div>
              </div>

              {/* Stores Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white rounded-2xl border border-[#EDE5DA] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-base text-[#1C120C] leading-snug">{store.name}</h4>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#8C5D3D] shrink-0" />
                            <span>{store.city}, {store.state} {store.zipCode}</span>
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#15803D] border border-[#C6ECCF]">
                          {store.status}
                        </span>
                      </div>

                      {/* Contact & Manager */}
                      <div className="mt-3 text-xs bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE5DA] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Store Manager:</span>
                          <span className="font-medium text-stone-800">{store.contactName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Phone / Email:</span>
                          <span className="font-mono text-stone-700">{store.contactPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Active Displays:</span>
                          <span className="font-bold text-stone-800">{store.screenCount} Screen(s)</span>
                        </div>
                      </div>

                      {/* Financial Split (65% Grocer Share) */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="text-stone-400 block text-[10px]">Monthly Ad Revenue:</span>
                          <span className="font-bold text-stone-900 font-mono text-sm">${store.totalMonthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">65% Grocer Share:</span>
                          <span className="font-bold text-emerald-700 font-mono text-sm">${store.merchantPayoutAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions: Preview Store Dashboard & Manage Screen */}
                    <div className="pt-3 border-t border-[#EDE5DA] flex items-center justify-between">
                      <button
                        onClick={() => onPreviewStoreDashboard(store)}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF5EE] hover:bg-[#F3E8DC] text-[#8C5D3D] border border-[#E8DCCD] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Open interactive merchant dashboard view"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Preview Store Dashboard</span>
                      </button>

                      {onOpenManageList && (
                        <button
                          onClick={() => onOpenManageList(store.activeBoardIds[0] || 'SM-LV-001')}
                          className="text-xs text-stone-600 hover:text-stone-900 underline cursor-pointer"
                        >
                          Manage Screen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 4: COMMUNITY PIN MODERATION & LISTINGS (PREVIOUS SUPER ADMIN)
             ===================================================================== */}
          {activeNav === 'listings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl border border-[#EDE5DA] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#F0E8DD]">
                  <div>
                    <h3 className="text-xl font-bold text-[#1C120C]">Community Board Pins & Flyer Moderation</h3>
                    <p className="text-xs text-[#7D6E65]">Active inventory of {pins.length} hyperlocal advertisements rotating across screens</p>
                  </div>
                  <button
                    onClick={() => setIsAddPinModalOpen(true)}
                    className="px-3.5 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Pin</span>
                  </button>
                </div>

                {/* Category Pills Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['All', 'Housing', 'Jobs', 'For Sale', 'Services', 'Community', 'Events', 'Store Special'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedPinCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        selectedPinCategory === cat
                          ? 'bg-[#583925] text-white shadow-xs'
                          : 'bg-[#FAF7F2] text-[#685549] border border-[#E8DFD3] hover:bg-[#F3ECE3]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pins Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pins
                  .filter((p) => selectedPinCategory === 'All' || p.category === selectedPinCategory)
                  .map((pin) => (
                    <div
                      key={pin.id}
                      className="bg-white rounded-2xl border border-[#EDE5DA] overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Pin Image Header */}
                        <div className="relative h-36 bg-stone-100 overflow-hidden">
                          <img
                            src={getDisplayImage(pin)}
                            alt={pin.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs">
                              {pin.category}
                            </span>
                          </div>
                          {pin.priceOrRate && (
                            <div className="absolute top-2.5 right-2.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white font-mono shadow-xs">
                                {pin.priceOrRate}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Pin Details */}
                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-sm text-[#1C120C] leading-snug line-clamp-1">
                            {pin.title}
                          </h4>
                          <p className="text-xs text-stone-600 line-clamp-2">
                            {pin.details}
                          </p>
                          <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                            <span>Tel: {pin.phone}</span>
                            <span className="font-mono">{pin.gridSize}</span>
                          </div>
                        </div>
                      </div>

                      {/* Inspect & Moderation Button */}
                      <div className="p-4 pt-0">
                        <button
                          onClick={() => setInspectedPin(pin)}
                          className="w-full py-2 bg-[#FAF5EE] hover:bg-[#F3E8DC] text-[#8C5D3D] border border-[#E8DCCD] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Pin & QR Code</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 5: ANALYTICS & FINDINGS (PREVIOUS DATA & MONETIZATION MATRIX)
             ===================================================================== */}
          {activeNav === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl border border-[#EDE5DA] p-6 shadow-2xs space-y-4">
                <h3 className="text-xl font-bold text-[#1C120C]">Platform Monetization Matrix & Ad Yield</h3>
                <p className="text-xs text-[#7D6E65]">DOOH ad grid performance, screen density, and cultural grocer revenue generation</p>
                <MonetizationMatrixChart />
              </div>

              <ExecutiveSummaryPanel />

              <div className="bg-white rounded-3xl border border-[#EDE5DA] p-6 shadow-2xs space-y-4">
                <h3 className="text-xl font-bold text-[#1C120C]">Granular In-Store Data Table</h3>
                <DataTableView />
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 6: PAYMENTS & FINANCIAL LEDGER
             ===================================================================== */}
          {(activeNav === 'payments' || activeNav === 'revenue') && (
            <div className="bg-white rounded-3xl border border-[#EDE5DA] p-6 shadow-2xs space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#F0E8DD]">
                <div>
                  <h3 className="text-xl font-bold text-[#1C120C]">Financial Ledger & Merchant 65% Payouts</h3>
                  <p className="text-xs text-[#7D6E65]">Real-time settlement stream, subscription renewals, and partner disbursements</p>
                </div>
                <button
                  onClick={() => showToast('✓ Payout batch export queued for ACH transmission')}
                  className="px-3.5 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Export ACH Settlement File
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F0E8DD] text-[11px] font-semibold text-[#96887F]">
                      <th className="pb-3">Transaction ID</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Store Partner</th>
                      <th className="pb-3">Gross Ad Revenue</th>
                      <th className="pb-3">65% Grocer Share</th>
                      <th className="pb-3">35% Platform Margin</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F2EC] text-[12px]">
                    {[
                      { id: 'TX-9041', date: 'Oct 31, 2026', store: 'Salam Market Las Vegas', gross: '$8,420.00', grocer: '$5,473.00', plat: '$2,947.00', type: 'Monthly Ad Cycle', status: 'Settled' },
                      { id: 'TX-9040', date: 'Oct 31, 2026', store: 'Habesha Market & Restaurant', gross: '$6,950.00', grocer: '$4,517.50', plat: '$2,432.50', type: 'Monthly Ad Cycle', status: 'Settled' },
                      { id: 'TX-9039', date: 'Oct 30, 2026', store: 'Selam Grocery & Spices', gross: '$5,870.00', grocer: '$3,815.50', plat: '$2,054.50', type: 'Monthly Ad Cycle', status: 'Settled' },
                      { id: 'TX-9038', date: 'Oct 30, 2026', store: 'Nile Market', gross: '$4,980.00', grocer: '$3,237.00', plat: '$1,743.00', type: 'Monthly Ad Cycle', status: 'Settled' },
                      { id: 'TX-9037', date: 'Oct 29, 2026', store: 'Ethio Fresh Market', gross: '$4,120.00', grocer: '$2,678.00', plat: '$1,442.00', type: 'Monthly Ad Cycle', status: 'Settled' },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAF6F1] transition-colors">
                        <td className="py-3 font-mono text-stone-500">{row.id}</td>
                        <td className="py-3 text-stone-600">{row.date}</td>
                        <td className="py-3 font-medium text-stone-900">{row.store}</td>
                        <td className="py-3 font-bold text-stone-900 font-mono">{row.gross}</td>
                        <td className="py-3 font-bold text-emerald-700 font-mono">{row.grocer}</td>
                        <td className="py-3 font-mono text-amber-900">{row.plat}</td>
                        <td className="py-3 text-stone-600">{row.type}</td>
                        <td className="py-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#15803D] border border-[#C6ECCF]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 7: MODERATION QUEUE
             ===================================================================== */}
          {activeNav === 'moderation' && (
            <div className="bg-white rounded-3xl border border-[#EDE5DA] p-6 shadow-2xs space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#F0E8DD]">
                <div>
                  <h3 className="text-xl font-bold text-[#1C120C]">Moderation & Content Review Desk</h3>
                  <p className="text-xs text-[#7D6E65]">Review user flyer submissions, auto-approval heuristics, and compliance checks</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">Auto-approval latency:</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                    1.0 sec
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'REV-101', title: 'Grand Ethiopian New Year Festival & Buffet', user: 'Dawit K.', store: 'Salam Market', time: '2 mins ago', status: 'Pending Review' },
                  { id: 'REV-102', title: 'Experienced Injera Baker & Kitchen Lead', user: 'Selam Kitchens', store: 'Habesha Market', time: '14 mins ago', status: 'Pending Review' },
                  { id: 'REV-103', title: 'Spacious 2BR Near Cultural Center with Parking', user: 'Amanuel T.', store: 'Selam Grocery', time: '35 mins ago', status: 'Pending Review' },
                ].map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-[#EDE5DA] bg-[#FAF7F2] flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#8C5D3D]">{item.id}</span>
                        <h4 className="font-bold text-sm text-[#1C120C]">{item.title}</h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Submitted by <span className="font-medium text-stone-800">{item.user}</span> for screen at <span className="font-medium text-stone-800">{item.store}</span> ({item.time})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`✓ Listing ${item.id} Approved & Broadcasting!`)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Instant Approve</span>
                      </button>
                      <button
                        onClick={() => showToast(`Listing ${item.id} flagged for seller verification`)}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 8: USERS, SUPPORT & SETTINGS PLACEHOLDERS
             ===================================================================== */}
          {(activeNav === 'users' || activeNav === 'support' || activeNav === 'settings') && (
            <div className="bg-white rounded-3xl border border-[#EDE5DA] p-8 shadow-2xs space-y-4 animate-fade-in text-center py-16">
              <div className="w-12 h-12 rounded-full bg-[#FAF3EC] border border-[#ECDDCF] flex items-center justify-center text-[#784A2F] mx-auto">
                <Settings className="w-6 h-6 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-bold text-[#1C120C] capitalize">{activeNav} Control Center</h3>
              <p className="text-xs text-[#7D6E65] max-w-md mx-auto">
                Real-time configuration, user role assignments, and platform parameters are synchronized with high-availability cloud endpoints.
              </p>
              <button
                onClick={() => setActiveNav('overview')}
                className="px-4 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Return to Overview
              </button>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODALS PRESERVED AND WIRED FOR HARDWARE, STORES, AND PINS
         ========================================================================= */}
      <RegisterBoardModal
        isOpen={isRegisterBoardModalOpen}
        onClose={() => setIsRegisterBoardModalOpen(false)}
        onRegisterBoard={(newBoard: BoardHardwareConfig) => {
          setBoards([newBoard, ...boards]);
          showToast(`✓ Board ${newBoard.id} registered and online!`);
        }}
        stores={stores}
      />

      <AddStoreModal
        isOpen={isAddStoreModalOpen}
        onClose={() => setIsAddStoreModalOpen(false)}
        onAddStore={(newStore: StorePartner) => {
          setStores([newStore, ...stores]);
          showToast(`✓ Store "${newStore.name}" registered successfully!`);
        }}
      />

      <AddPinModal
        isOpen={isAddPinModalOpen}
        onClose={() => setIsAddPinModalOpen(false)}
        onAddPin={(newPin: ListingCardItem) => {
          setPins([newPin, ...pins]);
          showToast(`✓ Pin "${newPin.title}" added to active bulletin rotation!`);
        }}
        boards={boards}
      />

      {inspectedPin && (
        <PinDetailModal
          item={inspectedPin}
          onClose={() => setInspectedPin(null)}
          storeName="Salam Market (Flagship)"
        />
      )}
    </div>
  );
};
