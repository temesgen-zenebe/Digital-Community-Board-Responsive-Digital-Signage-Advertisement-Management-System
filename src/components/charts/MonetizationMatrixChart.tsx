import React, { useState } from 'react';
import { DollarSign, Percent, TrendingUp, Sparkles, Building, Coins, Scale } from 'lucide-react';
import { calculateTileGridPercentages } from '../../utils/gridScale';
import type { TileGridSize } from '../../data/findingsData';

export const MonetizationMatrixChart: React.FC = () => {
  const [activeTier, setActiveTier] = useState<string>('housing');

  const tiers: {
    id: string;
    label: string;
    tileUnit: TileGridSize;
    price: number;
    duration: string;
    share: string;
    volume: number;
    gross: number;
    description: string;
  }[] = [
    {
      id: 'community',
      label: 'Community Notice',
      tileUnit: '1x1',
      price: 15,
      duration: '7 Days',
      share: '10%',
      volume: 392,
      gross: 5880,
      description: 'Volunteer drives, lost items, sports clubs, non-profit events.',
    },
    {
      id: 'for_sale',
      label: 'For Sale Ad',
      tileUnit: '1x1',
      price: 20,
      duration: '7 Days',
      share: '18%',
      volume: 706,
      gross: 14120,
      description: 'Vehicles, furniture, electronics, household appliances.',
    },
    {
      id: 'jobs',
      label: 'Job Hiring Post',
      tileUnit: '1x1',
      price: 35,
      duration: '14 Days',
      share: '22%',
      volume: 862,
      gross: 30170,
      description: 'Cashiers, drivers, cooks, store clerks, warehouse labor.',
    },
    {
      id: 'housing',
      label: 'Housing & Rental',
      tileUnit: '2x1',
      price: 40,
      duration: '14 Days',
      share: '28%',
      volume: 1098,
      gross: 43920,
      description: 'Apartments, rooms, subleases, roommate requests near UNLV.',
    },
    {
      id: 'services',
      label: 'Professional Service',
      tileUnit: '2x1',
      price: 60,
      duration: '30 Days',
      share: '15%',
      volume: 588,
      gross: 35280,
      description: 'Handyman, cleaning, tutoring, catering, tax & immigration help.',
    },
    {
      id: 'featured',
      label: 'Featured Event Banner',
      tileUnit: '3x1',
      price: 120,
      duration: '30 Days',
      share: '7%',
      volume: 274,
      gross: 32880,
      description: 'High-visibility hero spotlight & store promotion ribbon (e.g. Ethiopian Concert / Butcher specials).',
    },
  ];

  const currentTier = tiers.find((t) => t.id === activeTier) || tiers[3];

  const currentTierScale = calculateTileGridPercentages({
    tileUnit: currentTier.tileUnit,
    containerWidth: 1920,
    selectedTvProfileId: '65',
    gapPx: 12,
  });

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Unit Economics & Monetization
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">Dual Revenue Model</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mt-1">
            Ad Pricing Tiers & Partner Revenue Split
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            How physical grocery stores transform dead wall space into predictable recurring income.
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center">
          <Coins className="w-4 h-4" />
        </div>
      </div>

      {/* Revenue Split Ratio Visual */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 mb-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-800" />
            <span className="font-semibold text-stone-900">
              Store Host Partner Share: 65% ($31,408)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-stone-600" />
            <span className="font-medium text-stone-600">
              Platform & Hardware Maintenance: 35% ($16,912)
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-200">
          <div
            className="h-full bg-amber-700 transition-all duration-300"
            style={{ width: '65%' }}
            title="65% Host Store Payout"
          />
          <div
            className="h-full bg-stone-500 transition-all duration-300"
            style={{ width: '35%' }}
            title="35% Platform Fee"
          />
        </div>

        <p className="text-[11px] text-stone-500 mt-2">
          Stores like <strong>Salam Market Las Vegas</strong> earned <strong className="text-stone-900 font-semibold">$5,473</strong> in direct net ad payouts this month, plus free in-store promotion for meat and bread specials.
        </p>
      </div>

      {/* Tier Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {tiers.map((t) => {
          const isSelected = activeTier === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTier(t.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-amber-700 bg-amber-50/80 shadow-xs'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <span className="text-[11px] font-semibold text-stone-600 block line-clamp-1">
                {t.label}
              </span>
              <div className="flex items-baseline justify-between gap-1 mt-1">
                <span className="font-serif font-bold text-base text-stone-900">
                  ${t.price}
                </span>
                <span className="text-[9px] font-mono font-semibold px-1 py-0.5 rounded bg-amber-100/80 text-amber-900 border border-amber-200/80">
                  {t.tileUnit}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block">{t.duration}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Tier Deep-Dive Card */}
      <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-200/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <span className="font-bold text-stone-900 text-sm">
              {currentTier.label} Package (${currentTier.price} for {currentTier.duration})
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 border border-amber-300">
              Unit: {currentTier.tileUnit}
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-stone-700">
            <span>Store payout: ${(currentTier.price * 0.65).toFixed(2)}</span>
            <span className="text-stone-300">|</span>
            <span>Platform fee: ${(currentTier.price * 0.35).toFixed(2)}</span>
          </div>
        </div>

        <p className="text-stone-600 mb-2">{currentTier.description}</p>

        <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[11px] mb-2">
          <div className="p-2 bg-white/90 rounded border border-stone-200">
            <span className="text-stone-400 block">Category Share</span>
            <span className="font-bold text-stone-900">{currentTier.share}</span>
          </div>
          <div className="p-2 bg-white/90 rounded border border-stone-200">
            <span className="text-stone-400 block">Estimated Volume</span>
            <span className="font-bold text-stone-900">
              {currentTier.volume.toLocaleString()} listings
            </span>
          </div>
          <div className="p-2 bg-white/90 rounded border border-stone-200">
            <span className="text-stone-400 block">Gross Billing</span>
            <span className="font-bold text-stone-900">
              ${currentTier.gross.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dynamic CSS Grid Scaling Readout */}
        <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-amber-950">
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-800" />
            <span>Dynamic Grid Scaling:</span>
            <span className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-stone-900">
              <strong>{currentTierScale.tvScalings['55'].percentageStr}</strong> (55" TV)
            </span>
            <span className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-stone-900">
              <strong>{currentTierScale.tvScalings['65'].percentageStr}</strong> (65" TV)
            </span>
            <span className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-stone-900">
              <strong>{currentTierScale.tvScalings['75'].percentageStr}</strong> (75" TV)
            </span>
          </div>
          <span className="text-stone-500 text-[10px] truncate max-w-xs" title={currentTierScale.cssCalcWidth}>
            CSS: {currentTierScale.cssCalcWidth}
          </span>
        </div>
      </div>
    </div>
  );
};
