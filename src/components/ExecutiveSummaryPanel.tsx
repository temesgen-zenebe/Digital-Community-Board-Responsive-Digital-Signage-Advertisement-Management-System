import React from 'react';
import {
  FileText,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  ShieldAlert,
} from 'lucide-react';

export const ExecutiveSummaryPanel: React.FC = () => {
  const findings = [
    {
      num: '01',
      title: 'Housing & Employment Represent 50% of Total Ad Demand',
      icon: MapPin,
      highlight: '50% Total Share',
      content:
        'Across 3,920 active listings, Housing (28% / 1,098 ads) and Jobs (22% / 862 ads) represent half of all board activity. Cultural groceries serve as essential settlement and employment infrastructure for diaspora communities near university and service corridors (e.g. UNLV in Las Vegas).',
    },
    {
      num: '02',
      title: 'Flagship Store Generates 17.4% of Total Platform GMV',
      icon: TrendingUp,
      highlight: '$8,420 Revenue',
      content:
        'Salam Market Las Vegas ranks #1 across all 186 network stores with $8,420 monthly revenue from 362 orders and 480 listings. The top 5 stores (Salam Market, Habesha Market, Selam Grocery, Nile Market, Ethio Fresh) account for 62.8% of total network revenue.',
    },
    {
      num: '03',
      title: 'Weekend Foot-Traffic Spikes Yield 2.3x Conversion Lift',
      icon: Clock,
      highlight: '+114% Weekend Peak',
      content:
        'Daily screen impressions ramp from 14.8k on October 1 to a weekend high of 58.9k on October 31. Saturdays and Sundays concentrate over 54% of new booking checkout conversions, as customers interact with in-store displays while shopping for weekend staples.',
    },
    {
      num: '04',
      title: 'High Network Reliability with 99.9% Hardware Uptime',
      icon: Sparkles,
      highlight: '99.9% Screen Uptime',
      content:
        'Out of 186 enrolled store locations, 142 (76.3%) are actively streaming with green telemetry heartbeats, 18 (9.7%) are pending display rollout, 14 are temporarily paused, and 12 are suspended. Moderation backlogs remain lean with only 24 pending listings and 5 reported items.',
    },
    {
      num: '05',
      title: 'Dual-Incentive Monetization Drives Host Grocer Retention',
      icon: ShoppingBag,
      highlight: '65% Host Revenue Share',
      content:
        'Store owners receive 65% of ad booking revenue ($31,408 platform-wide payout) while gaining prime digital billboard space for high-margin butcher and bakery inventory (Fresh Halal Meats, Injera, Teff, Dabo bread) at zero out-of-pocket marketing expense.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
          Synthesis & Strategic Insights
        </span>
        <span className="text-stone-300">·</span>
        <span className="text-xs text-stone-500">Document Findings</span>
      </div>
      <h3 className="text-lg font-bold text-stone-900 font-serif mb-1">
        Key Analytical Findings
      </h3>
      <p className="text-xs text-stone-500 mb-6">
        Distilled takeaways from platform telemetry, store manager dashboards, and in-store TV kiosk data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {findings.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.num}
              className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 flex flex-col justify-between hover:bg-stone-50 hover:border-amber-200 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-xs text-amber-800">
                    FINDING {f.num}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded">
                    {f.highlight}
                  </span>
                </div>

                <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>{f.title}</span>
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {f.content}
                </p>
              </div>

              <div className="text-[11px] text-stone-400 border-t border-stone-200/60 pt-2 flex items-center justify-between">
                <span>Validated by platform metrics</span>
                <span>Oct 2026 data</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
