import React, { useState } from 'react';
import { TOP_STORES_FINDINGS, type StoreMetric } from '../../data/findingsData';
import { Store, DollarSign, ShoppingCart, FileText, CheckCircle2 } from 'lucide-react';

interface StoreLeaderboardChartProps {
  onSelectStore?: (store: StoreMetric) => void;
}

type MetricMode = 'revenue' | 'orders' | 'listings' | 'avgOrder';

export const StoreLeaderboardChart: React.FC<StoreLeaderboardChartProps> = ({
  onSelectStore,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('revenue');
  const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null);

  const getMetricValue = (store: StoreMetric, mode: MetricMode): number => {
    switch (mode) {
      case 'revenue':
        return store.revenue;
      case 'orders':
        return store.orders;
      case 'listings':
        return store.activeListings;
      case 'avgOrder':
        return store.avgOrderValue;
    }
  };

  const formatValue = (val: number, mode: MetricMode): string => {
    switch (mode) {
      case 'revenue':
        return `$${val.toLocaleString()}`;
      case 'orders':
        return `${val.toLocaleString()} orders`;
      case 'listings':
        return `${val.toLocaleString()} listings`;
      case 'avgOrder':
        return `$${val.toFixed(2)}`;
    }
  };

  const maxValue = Math.max(
    ...TOP_STORES_FINDINGS.map((s) => getMetricValue(s, metricMode))
  );

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 flex flex-col justify-between">
      {/* Header & Metric Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Merchant Fleet
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">186 Total Locations</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mt-1">
            Top Performing Stores
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Store-level revenue generation, customer orders, and active billboard utilization.
          </p>
        </div>

        {/* Metric Segmented Control */}
        <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('revenue')}
            className={`px-3 py-1.5 font-medium rounded-md transition-all ${
              metricMode === 'revenue'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 inline mr-1" />
            Revenue
          </button>
          <button
            onClick={() => setMetricMode('orders')}
            className={`px-3 py-1.5 font-medium rounded-md transition-all ${
              metricMode === 'orders'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 inline mr-1" />
            Orders
          </button>
          <button
            onClick={() => setMetricMode('listings')}
            className={`px-3 py-1.5 font-medium rounded-md transition-all ${
              metricMode === 'listings'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Listings
          </button>
          <button
            onClick={() => setMetricMode('avgOrder')}
            className={`px-3 py-1.5 font-medium rounded-md transition-all ${
              metricMode === 'avgOrder'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Avg Ticket
          </button>
        </div>
      </div>

      {/* Bar Chart List */}
      <div className="space-y-4">
        {TOP_STORES_FINDINGS.map((store) => {
          const val = getMetricValue(store, metricMode);
          const percentWidth = Math.max(8, (val / maxValue) * 100);
          const isHovered = hoveredStoreId === store.id;
          const isFlagship = store.id === 'salam-lv';

          return (
            <div
              key={store.id}
              onMouseEnter={() => setHoveredStoreId(store.id)}
              onMouseLeave={() => setHoveredStoreId(null)}
              onClick={() => onSelectStore && onSelectStore(store)}
              className={`p-3 rounded-lg border transition-all duration-150 ${
                onSelectStore ? 'cursor-pointer' : ''
              } ${
                isHovered
                  ? 'bg-amber-50/60 border-amber-300'
                  : 'bg-stone-50/50 border-stone-200/70 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
                      isFlagship
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    #{store.rank}
                  </span>
                  <span className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                    {store.name}
                    {isFlagship && (
                      <span className="text-[10px] font-sans text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                        Flagship Location
                      </span>
                    )}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500">
                    {store.city}, {store.state}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-stone-900 font-mono text-sm">
                    {formatValue(val, metricMode)}
                  </span>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{store.screenUptime} uptime</span>
                  </div>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="w-full bg-stone-200/80 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFlagship
                      ? 'bg-amber-700'
                      : store.id === 'other-stores'
                      ? 'bg-stone-400'
                      : 'bg-amber-500/90'
                  }`}
                  style={{ width: `${percentWidth}%` }}
                />
              </div>

              {/* Subtle metadata row */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5">
                <div className="flex items-center gap-2">
                  <span>${store.revenue.toLocaleString()} revenue</span>
                  <span aria-hidden="true">·</span>
                  <span>{store.orders} orders</span>
                  <span aria-hidden="true">·</span>
                  <span>{store.activeListings} active ads</span>
                </div>
                <div>
                  <span className="text-stone-400">
                    Share: {((store.revenue / 48320) * 100).toFixed(1)}% of platform
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer Insight */}
      <div className="mt-5 pt-4 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-800" />
          <span>
            Top 5 grocery locations generate{' '}
            <strong className="text-stone-900 font-semibold">62.8% ($30,340)</strong> of
            network ad volume.
          </span>
        </div>
        <span className="text-stone-500">Average basket: ~$23.20</span>
      </div>
    </div>
  );
};
