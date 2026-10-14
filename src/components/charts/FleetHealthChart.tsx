import React, { useState } from 'react';
import {
  FLEET_STATUS_FINDINGS,
  MODERATION_FINDINGS,
  type FleetStatus,
} from '../../data/findingsData';
import {
  ShieldCheck,
  Server,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const FleetHealthChart: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const totalStores = FLEET_STATUS_FINDINGS.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Operations & Reliability
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">186 Hardware Displays</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-serif mt-1">
            Store Fleet Status & Moderation Queue
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time physical display uptime, onboarding lifecycle, and content moderation throughput.
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {/* Fleet Distribution Proportional Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-stone-700">
            Hardware Fleet Deployment ({totalStores} locations)
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            99.9% Fleet Uptime
          </span>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-stone-100 p-0.5 border border-stone-200">
          {FLEET_STATUS_FINDINGS.map((item) => (
            <div
              key={item.status}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              title={`${item.status}: ${item.count} stores (${item.percentage}%)`}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 cursor-pointer hover:opacity-90"
              onClick={() => setSelectedStatus(item.status)}
            />
          ))}
        </div>

        {/* Status Legend Pills (Zero-pill compliant clean text row) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {FLEET_STATUS_FINDINGS.map((item) => {
            const isSelected = selectedStatus === item.status;
            return (
              <button
                key={item.status}
                onClick={() =>
                  setSelectedStatus(isSelected ? null : item.status)
                }
                className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50/70'
                    : 'border-stone-200/80 bg-stone-50/60 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-stone-800 line-clamp-1">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-stone-900 font-mono text-sm">
                    {item.count}
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    {item.percentage}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Moderation Queue & Hardware Health split grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Moderation Queue */}
        <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              Content Moderation Queue
            </span>
            <span className="text-[11px] text-amber-800 font-medium">
              40 Items Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {MODERATION_FINDINGS.map((mod) => (
              <div
                key={mod.type}
                className="flex items-center justify-between p-2 bg-white rounded border border-stone-200/60"
              >
                <div>
                  <span className="font-medium text-stone-800">{mod.type}</span>
                  <span className="text-[11px] text-stone-400 block">
                    {mod.actionLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono font-bold px-1.5 py-0.5 rounded text-xs ${
                      mod.severity === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : mod.severity === 'attention'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {mod.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Status & Telemetry */}
        <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-amber-800" />
                Physical Screen Heartbeat
              </span>
              <span className="inline-flex items-center text-[11px] text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1 animate-ping" />
                Operational
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Network Screen Status</span>
                <span className="font-medium text-emerald-700">Online (All 186 pinging)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Last Telemetry Sync</span>
                <span className="font-mono text-stone-700">Oct 31, 2026 12:08 PM</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Firmware / App Version</span>
                <span className="font-mono text-stone-700">v1.2.0 (React/Vite Engine)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-stone-500">Hardware Fleet Uptime</span>
                <span className="font-mono font-bold text-stone-900">99.9% continuous</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>Auto-refresh heartbeat checks every 60 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
