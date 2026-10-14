import React, { useState } from 'react';
import { CATEGORY_FINDINGS, type CategoryMetric } from '../../data/findingsData';
import { Info, Layers } from 'lucide-react';

interface CategoryDonutChartProps {
  scope: 'platform' | 'store';
  onSelectCategory?: (category: CategoryMetric | null) => void;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  scope,
  onSelectCategory,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const totalListings = scope === 'platform' ? 3920 : 186;

  // Calculate angles for donut slices
  let cumulativeAngle = -90; // Start at top (12 o'clock)
  const slices = CATEGORY_FINDINGS.map((cat) => {
    const angle = (cat.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    return {
      ...cat,
      startAngle,
      endAngle,
      midAngle: startAngle + angle / 2,
    };
  });

  // Convert polar coordinates to Cartesian
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createDonutPath = (
    cx: number,
    cy: number,
    rInner: number,
    rOuter: number,
    startDeg: number,
    endDeg: number
  ) => {
    // Offset angle to match our -90 start
    const sDeg = startDeg + 90;
    const eDeg = endDeg + 90;
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;

    const p1 = polarToCartesian(cx, cy, rOuter, sDeg);
    const p2 = polarToCartesian(cx, cy, rOuter, eDeg);
    const p3 = polarToCartesian(cx, cy, rInner, eDeg);
    const p4 = polarToCartesian(cx, cy, rInner, sDeg);

    return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
  };

  const activeCategory =
    CATEGORY_FINDINGS.find((c) => c.id === (hoveredId || selectedId)) || null;

  const handleSliceClick = (cat: CategoryMetric) => {
    const nextId = selectedId === cat.id ? null : cat.id;
    setSelectedId(nextId);
    if (onSelectCategory) {
      onSelectCategory(nextId ? cat : null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Distribution Analysis
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">
              {scope === 'platform' ? 'Platform Wide (186 Stores)' : 'Salam Market Flagship'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mt-1">
            Listings by Category
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Breakdown of community post volume, pricing tiers, and community demand.
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut graphic */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <svg
            viewBox="0 0 280 280"
            className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-sm select-none"
            role="img"
            aria-label="Donut chart showing listings by category"
          >
            {slices.map((slice) => {
              const isHovered = hoveredId === slice.id;
              const isSelected = selectedId === slice.id;
              const outerRadius = isHovered || isSelected ? 128 : 120;
              const innerRadius = 78;

              return (
                <path
                  key={slice.id}
                  d={createDonutPath(140, 140, innerRadius, outerRadius, slice.startAngle, slice.endAngle)}
                  fill={slice.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-all duration-200 cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoveredId(slice.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleSliceClick(slice)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSliceClick(slice);
                    }
                  }}
                  aria-label={`${slice.name}: ${slice.percentage}% (${scope === 'platform' ? slice.platformCount : slice.storeCount} listings)`}
                />
              );
            })}

            {/* Donut Center Core */}
            <circle cx="140" cy="140" r="76" fill="#FFFFFF" />
            <text
              x="140"
              y="132"
              textAnchor="middle"
              className="font-serif font-bold text-2xl fill-stone-900"
            >
              {activeCategory
                ? scope === 'platform'
                  ? activeCategory.platformCount.toLocaleString()
                  : activeCategory.storeCount.toLocaleString()
                : totalListings.toLocaleString()}
            </text>
            <text
              x="140"
              y="152"
              textAnchor="middle"
              className="text-[11px] font-medium fill-stone-500 uppercase tracking-wider"
            >
              {activeCategory ? activeCategory.name.split(' ')[0] : 'Active Listings'}
            </text>
            {activeCategory && (
              <text
                x="140"
                y="170"
                textAnchor="middle"
                className="text-xs font-semibold fill-amber-800"
              >
                {activeCategory.percentage}% of total
              </text>
            )}
          </svg>

          <p className="text-[11px] text-stone-400 mt-2 text-center">
            Click or hover any slice to isolate category details
          </p>
        </div>

        {/* Legend and category metrics list */}
        <div className="md:col-span-7 space-y-2">
          {CATEGORY_FINDINGS.map((cat) => {
            const count = scope === 'platform' ? cat.platformCount : cat.storeCount;
            const isHovered = hoveredId === cat.id;
            const isSelected = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleSliceClick(cat)}
                className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50/80'
                    : isHovered
                    ? 'border-stone-300 bg-stone-50'
                    : 'border-transparent hover:bg-stone-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-900">
                        {cat.name}
                      </span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500">
                        avg fee ${cat.avgFee.toFixed(0)}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500 line-clamp-1">
                      {cat.description}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <div className="text-sm font-bold text-stone-900 font-mono">
                    {cat.percentage}%
                  </div>
                  <div className="text-xs text-stone-500">
                    {count.toLocaleString()} posts
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Box */}
      {activeCategory && (
        <div className="mt-5 p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs text-stone-700">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>Category Deep-Dive: {activeCategory.name}</span>
          </div>
          <p className="text-stone-600 mb-2">
            Accounts for <span className="font-semibold text-stone-900">{activeCategory.percentage}%</span> of all active community board flyers ({scope === 'platform' ? activeCategory.platformCount : activeCategory.storeCount} total).
            Estimated average ad booking duration fee: <span className="font-semibold text-stone-900">${activeCategory.avgFee}</span>.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-500 font-medium">Common postings:</span>
            {activeCategory.topExamples.map((ex, idx) => (
              <span
                key={idx}
                className="bg-white/80 border border-stone-200 px-2 py-0.5 rounded text-stone-800 text-[11px]"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
