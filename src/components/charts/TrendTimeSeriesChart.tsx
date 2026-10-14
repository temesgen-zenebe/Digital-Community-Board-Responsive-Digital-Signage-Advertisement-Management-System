import React, { useState } from 'react';
import { generateDailyTrendData, type DailyPoint } from '../../data/findingsData';
import { TrendingUp, Calendar } from 'lucide-react';

interface TrendTimeSeriesChartProps {
  scope: 'platform' | 'store';
}

type MetricType = 'revenue' | 'views' | 'users' | 'orders';
type TimeframeFilter = 'all' | 'last7' | 'weekends';

export const TrendTimeSeriesChart: React.FC<TrendTimeSeriesChartProps> = ({
  scope,
}) => {
  const [metric, setMetric] = useState<MetricType>('revenue');
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('all');
  const [hoveredPoint, setHoveredPoint] = useState<DailyPoint | null>(null);

  const rawData = generateDailyTrendData();

  const filteredData = rawData.filter((pt) => {
    if (timeframe === 'last7') return pt.day >= 25;
    if (timeframe === 'weekends') return pt.isWeekend;
    return true;
  });

  const getValue = (pt: DailyPoint, m: MetricType, s: 'platform' | 'store'): number => {
    if (s === 'platform') {
      switch (m) {
        case 'revenue':
          return pt.platformRevenue;
        case 'views':
          return pt.platformViews;
        case 'users':
          return pt.platformUsers;
        case 'orders':
          return pt.platformOrders;
      }
    } else {
      switch (m) {
        case 'revenue':
          return pt.storeRevenue;
        case 'views':
          return pt.storeViews;
        case 'users':
          return pt.storeUsers;
        case 'orders':
          return Math.round(pt.storeRevenue / 23);
      }
    }
  };

  const formatValue = (val: number, m: MetricType): string => {
    switch (m) {
      case 'revenue':
        return `$${val.toLocaleString()}`;
      case 'views':
        return `${val.toLocaleString()} views`;
      case 'users':
        return `${val.toLocaleString()} visitors`;
      case 'orders':
        return `${val.toLocaleString()} bookings`;
    }
  };

  // Dimensions for SVG viewport
  const width = 800;
  const height = 300;
  const paddingLeft = 60;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const values = filteredData.map((d) => getValue(d, metric, scope));
  const minVal = 0;
  const maxVal = Math.max(...values) * 1.15; // 15% headroom

  const getX = (index: number) => {
    if (filteredData.length <= 1) return paddingLeft + chartW / 2;
    return paddingLeft + (index / (filteredData.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    if (maxVal === 0) return height - paddingBottom;
    return height - paddingBottom - (val / maxVal) * chartH;
  };

  // Build SVG path strings
  const pointsCoords = filteredData.map((pt, idx) => ({
    x: getX(idx),
    y: getY(getValue(pt, metric, scope)),
    data: pt,
  }));

  // Smooth Bezier path
  const linePath = pointsCoords.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${pointsCoords[pointsCoords.length - 1]?.x || 0} ${height - paddingBottom} L ${pointsCoords[0]?.x || 0} ${height - paddingBottom} Z`;

  // Y-axis ticks (4 intervals)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = Math.round(maxVal * pct);
    return {
      val,
      y: getY(val),
    };
  });

  const activePoint = hoveredPoint || pointsCoords[pointsCoords.length - 1]?.data;
  const activeValue = activePoint ? getValue(activePoint, metric, scope) : 0;

  const totalSum = filteredData.reduce((acc, curr) => acc + getValue(curr, metric, scope), 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 flex flex-col justify-between">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Temporal Trajectory
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">
              October 1 – October 31, 2026 ({scope === 'platform' ? 'Platform Wide' : 'Salam Market'})
            </span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mt-1">
            Growth Trends & Engagement Dynamics
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Evaluate foot-traffic velocity, weekend ad surges, and cumulative monetization.
          </p>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setMetric('revenue')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                metric === 'revenue'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setMetric('views')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                metric === 'views'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Screen Views
            </button>
            <button
              onClick={() => setMetric('users')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                metric === 'users'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Unique Users
            </button>
            <button
              onClick={() => setMetric('orders')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                metric === 'orders'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Orders
            </button>
          </div>

          {/* Timeframe Scope Filter */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setTimeframe('all')}
              className={`px-2.5 py-1.5 font-medium rounded-md transition-all ${
                timeframe === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All 31 Days
            </button>
            <button
              onClick={() => setTimeframe('last7')}
              className={`px-2.5 py-1.5 font-medium rounded-md transition-all ${
                timeframe === 'last7'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Oct 25-31
            </button>
            <button
              onClick={() => setTimeframe('weekends')}
              className={`px-2.5 py-1.5 font-medium rounded-md transition-all ${
                timeframe === 'weekends'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Weekends
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-50 rounded-lg border border-stone-200/70 mb-4 text-xs">
        <div>
          <span className="text-stone-500 block">Period Total</span>
          <span className="font-bold text-stone-900 text-sm font-mono">
            {formatValue(totalSum, metric)}
          </span>
        </div>
        <div>
          <span className="text-stone-500 block">Peak Single Day</span>
          <span className="font-bold text-stone-900 text-sm font-mono">
            {formatValue(Math.max(...values), metric)}
          </span>
        </div>
        <div>
          <span className="text-stone-500 block">Weekend Lift</span>
          <span className="font-bold text-emerald-700 text-sm">
            +114% vs Weekdays
          </span>
        </div>
        <div>
          <span className="text-stone-500 block">
            {hoveredPoint ? `${hoveredPoint.dateStr} (${hoveredPoint.weekday})` : 'Active Point'}
          </span>
          <span className="font-bold text-amber-900 text-sm font-mono">
            {activePoint ? formatValue(activeValue, metric) : '—'}
          </span>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64 sm:h-72"
          role="img"
          aria-label="Trend line chart showing 30 day performance"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C07D53" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#C07D53" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B4513" />
              <stop offset="50%" stopColor="#C07D53" />
              <stop offset="100%" stopColor="#A0522D" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y axis ticks */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={width - paddingRight}
                y2={tick.y}
                stroke="#E7E5E4"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[10px] fill-stone-400 font-mono"
              >
                {metric === 'revenue'
                  ? `$${tick.val >= 1000 ? `${(tick.val / 1000).toFixed(0)}k` : tick.val}`
                  : tick.val >= 1000
                  ? `${(tick.val / 1000).toFixed(0)}k`
                  : tick.val}
              </text>
            </g>
          ))}

          {/* Shaded Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Smooth Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive vertical hover indicator */}
          {hoveredPoint && (
            (() => {
              const hoverIdx = filteredData.findIndex((d) => d.day === hoveredPoint.day);
              if (hoverIdx < 0) return null;
              const hoverX = getX(hoverIdx);
              const hoverY = getY(getValue(hoveredPoint, metric, scope));
              return (
                <g>
                  <line
                    x1={hoverX}
                    y1={paddingTop}
                    x2={hoverX}
                    y2={height - paddingBottom}
                    stroke="#8B4513"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={hoverX}
                    cy={hoverY}
                    r="6"
                    fill="#8B4513"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="drop-shadow-sm"
                  />
                </g>
              );
            })()
          )}

          {/* Data Points and Invisible Hit Areas */}
          {pointsCoords.map((pt, idx) => {
            const isHovered = hoveredPoint?.day === pt.data.day;
            const isLast = idx === pointsCoords.length - 1;

            return (
              <g key={pt.data.day}>
                {/* Small indicator circle on points */}
                {(isHovered || isLast || pt.data.isWeekend) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3.5}
                    fill={pt.data.isWeekend ? '#8B4513' : '#C07D53'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                )}

                {/* X-axis dates for select points */}
                {(pt.data.day === 1 ||
                  pt.data.day === 5 ||
                  pt.data.day === 10 ||
                  pt.data.day === 15 ||
                  pt.data.day === 20 ||
                  pt.data.day === 25 ||
                  pt.data.day === 31 ||
                  timeframe !== 'all') && (
                  <text
                    x={pt.x}
                    y={height - paddingBottom + 18}
                    textAnchor="middle"
                    className="text-[10px] fill-stone-500 font-mono"
                  >
                    {pt.data.dateStr}
                  </text>
                )}

                {/* Invisible wide hit target for hover */}
                <rect
                  x={pt.x - chartW / (filteredData.length * 2)}
                  y={paddingTop}
                  width={chartW / filteredData.length}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt.data)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Insight */}
      <div className="mt-4 pt-3 border-t border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-amber-800" />
          <span>
            Weekend grocery foot traffic produces{' '}
            <strong className="text-stone-900 font-semibold">2.3x higher order conversion</strong>{' '}
            compared to Tuesday-Wednesday baseline.
          </span>
        </div>
        <span className="text-stone-400">
          Source: In-store camera impressions & Stripe checkout webhooks
        </span>
      </div>
    </div>
  );
};
