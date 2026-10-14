import React from 'react';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive?: boolean;
  timeframe?: string;
  icon?: LucideIcon;
  subtitle?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  timeframe = 'vs last 30 days',
  icon: Icon,
  subtitle,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative p-5 rounded-xl border transition-all duration-200 text-left ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${
        isActive
          ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-500/30'
          : 'bg-white border-stone-200/90 hover:border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-stone-900 font-serif">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center font-medium ${
            isPositive ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline" />
          )}
          {change}
        </span>
        <span className="text-stone-400">·</span>
        <span className="text-stone-500">{timeframe}</span>
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-stone-500 border-t border-stone-100 pt-2 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
