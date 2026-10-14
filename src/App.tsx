import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Eye,
  Users,
  Store,
  FileText,
  ShoppingCart,
  Tv,
  BarChart3,
  Table as TableIcon,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

import { MetricCard } from './components/MetricCard';
import { CategoryDonutChart } from './components/charts/CategoryDonutChart';
import { StoreLeaderboardChart } from './components/charts/StoreLeaderboardChart';
import { TrendTimeSeriesChart } from './components/charts/TrendTimeSeriesChart';
import { FleetHealthChart } from './components/charts/FleetHealthChart';
import { MonetizationMatrixChart } from './components/charts/MonetizationMatrixChart';
import { CorkboardPreviewModal } from './components/CorkboardPreviewModal';
import { DataTableView } from './components/DataTableView';
import { ExecutiveSummaryPanel } from './components/ExecutiveSummaryPanel';
import { DigitalCorkboardKiosk } from './components/kiosk/DigitalCorkboardKiosk';
import type { CategoryMetric, StoreMetric } from './data/findingsData';

export default function App() {
  const [scope, setScope] = useState<'platform' | 'store'>('platform');
  // If URL contains QR deep links (?pin=... or ?register=... or ?view=kiosk), default directly to kiosk view
  const [activeView, setActiveView] = useState<'charts' | 'insights' | 'table' | 'kiosk'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('pin') || params.get('register') || params.get('view') === 'kiosk' || params.has('kiosk')) {
          return 'kiosk';
        }
      } catch {
        // Fallback to charts
      }
    }
    return 'charts';
  });
  const [isCorkboardOpen, setIsCorkboardOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryMetric | null>(null);

  // Switch to kiosk view if URL parameters change or user navigates via QR deep links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const hasHashParams =
          window.location.hash.includes('pin=') ||
          window.location.hash.includes('register=') ||
          window.location.hash.includes('kiosk');
        if (
          params.get('pin') ||
          params.get('register') ||
          params.get('view') === 'kiosk' ||
          params.has('kiosk') ||
          hasHashParams
        ) {
          setActiveView('kiosk');
        }
      } catch {
        // Fallback
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // If in dedicated full-screen kiosk view, render the kiosk full screen immediately
  if (activeView === 'kiosk') {
    return (
      <DigitalCorkboardKiosk
        onExitFullscreen={() => setActiveView('charts')}
        isEmbedded={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 pb-16">
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B4513] to-[#5A2C0D] flex items-center justify-center text-white shadow-xs">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
                  Community Board Analytics
                </h1>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                  Findings & Data Visualizations
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Hyperlocal Digital Bulletin Board & Merchant DOOH Ad Platform
              </p>
            </div>
          </div>

          {/* Scope and Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Scope Switcher: Platform vs Store */}
            <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setScope('platform')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-all ${
                  scope === 'platform'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Platform (186 Stores)
              </button>
              <button
                onClick={() => setScope('store')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-all ${
                  scope === 'store'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Salam Market (Flagship)
              </button>
            </div>

            {/* Launch In-Store Corkboard Screen Preview */}
            <button
              onClick={() => setIsCorkboardOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B4513] hover:bg-[#72370E] text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
              title="Preview actual in-store TV corkboard screen"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In-Store Screen</span>
              <span className="sm:hidden">Screen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Intro Subheader & View Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold uppercase tracking-wider mb-1">
              <span>Document Summary & Analysis</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-normal">October 2026 Snapshot</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {scope === 'platform'
                ? 'Community Board Platform Overview'
                : 'Salam Market – Store Level Performance'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
              Synthesized visual intelligence based on the multi-store platform data, in-store hardware displays, and category demand across Ethiopian and cultural grocery stores.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-white border border-stone-200 rounded-xl text-xs font-medium shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setActiveView('charts')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                activeView === 'charts'
                  ? 'bg-amber-100/70 text-amber-950 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-800" />
              <span>Interactive Charts</span>
            </button>
            <button
              onClick={() => setActiveView('insights')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                activeView === 'insights'
                  ? 'bg-amber-100/70 text-amber-950 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Key Findings</span>
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                activeView === 'table'
                  ? 'bg-amber-100/70 text-amber-950 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-amber-800" />
              <span>Data Table</span>
            </button>
            <button
              onClick={() => setActiveView('kiosk')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all bg-[#8B4513]/10 hover:bg-[#8B4513]/20 text-[#8B4513] font-semibold`}
            >
              <Tv className="w-3.5 h-3.5 text-[#8B4513]" />
              <span>In-Store Kiosk (Full Screen)</span>
            </button>
          </div>
        </div>

        {/* High-Level KPI Metric Strip */}
        <section aria-label="Key Performance Indicators">
          {scope === 'platform' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <MetricCard
                label="Total Revenue"
                value="$48,320"
                change="22%"
                icon={DollarSign}
                subtitle="65% paid to host grocers"
              />
              <MetricCard
                label="Total Views"
                value="1,245,680"
                change="28%"
                icon={Eye}
                subtitle="In-store foot impressions"
              />
              <MetricCard
                label="Total Users"
                value="28,490"
                change="18%"
                icon={Users}
                subtitle="2,480 new users in Oct"
              />
              <MetricCard
                label="Total Stores"
                value="186"
                change="12%"
                icon={Store}
                subtitle="142 active hardware screens"
              />
              <MetricCard
                label="Active Listings"
                value="3,920"
                change="24%"
                icon={FileText}
                subtitle="Housing & Jobs = 50%"
              />
              <MetricCard
                label="Total Orders"
                value="2,184"
                change="26%"
                icon={ShoppingCart}
                subtitle="Avg ticket $23.20"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <MetricCard
                label="Store Revenue"
                value="$1,248"
                change="18%"
                icon={DollarSign}
                subtitle="Flagship location share"
              />
              <MetricCard
                label="Total Views"
                value="42,580"
                change="25%"
                icon={Eye}
                subtitle="Screen #LV-01 foot traffic"
              />
              <MetricCard
                label="Unique Users"
                value="3,920"
                change="22%"
                icon={Users}
                subtitle="Store shoppers interacting"
              />
              <MetricCard
                label="Active Listings"
                value="186"
                change="12%"
                icon={FileText}
                subtitle="On-screen pinned flyers"
              />
              <MetricCard
                label="Store Orders"
                value="142"
                change="18%"
                icon={ShoppingCart}
                subtitle="100% paid via Stripe"
              />
            </div>
          )}
        </section>

        {/* View Content Renderer */}
        {activeView === 'charts' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Row 1: Category Donut + Store Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6 flex flex-col">
                <CategoryDonutChart
                  scope={scope}
                  onSelectCategory={(cat) => setSelectedCategory(cat)}
                />
              </div>
              <div className="lg:col-span-6 flex flex-col">
                <StoreLeaderboardChart />
              </div>
            </div>

            {/* Row 2: 30-Day Growth Trends & Weekend Analysis */}
            <div>
              <TrendTimeSeriesChart scope={scope} />
            </div>

            {/* Row 3: Fleet Health & Unit Economics Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6 flex flex-col">
                <FleetHealthChart />
              </div>
              <div className="lg:col-span-6 flex flex-col">
                <MonetizationMatrixChart />
              </div>
            </div>
          </div>
        )}

        {activeView === 'insights' && (
          <div className="space-y-6">
            <ExecutiveSummaryPanel />
            {/* Quick Chart highlight below */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryDonutChart scope={scope} />
              <StoreLeaderboardChart />
            </div>
          </div>
        )}

        {activeView === 'table' && (
          <div>
            <DataTableView />
          </div>
        )}

        {/* Interactive Corkboard Modal Component */}
        <CorkboardPreviewModal
          isOpen={isCorkboardOpen}
          onClose={() => setIsCorkboardOpen(false)}
        />
      </main>

      {/* Quiet Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-200 text-stone-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>Community Board Platform Intelligence</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-stone-700">Salam Market</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCorkboardOpen(true)}
            className="hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Open In-Store Corkboard</span>
          </button>
          <span aria-hidden="true">·</span>
          <span>October 2026 Telemetry Snapshot</span>
        </div>
      </footer>
    </div>
  );
}
