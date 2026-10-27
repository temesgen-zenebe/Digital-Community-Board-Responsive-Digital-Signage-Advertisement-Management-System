import React, { useState } from 'react';
import {
  X,
  Flame,
  Store,
  Tag,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { INITIAL_STORE_SPECIALS, type StoreSpecialItem } from '../../data/storeSpecialsData';

interface StoreSpecialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeId?: string;
  onOpenStoreDashboard?: () => void;
}

export const StoreSpecialsModal: React.FC<StoreSpecialsModalProps> = ({
  isOpen,
  onClose,
  storeName,
  storeId = 'salam-lv',
  onOpenStoreDashboard,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');

  if (!isOpen) return null;

  // Filter specials for this store (or default to salam-lv specials)
  const storeSpecials = INITIAL_STORE_SPECIALS.filter(
    (s) => s.storeId === storeId || s.storeId === 'salam-lv'
  );

  const departments = ['All', 'Bakery & Injera', 'Butchery & Meat', 'Spices & Grains', 'Coffee & Tea', 'Deli & Prepared'];

  const filteredSpecials = storeSpecials.filter((s) => {
    if (selectedDept === 'All') return true;
    return s.department === selectedDept;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="specials-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FFFDF9] border-2 border-[#D4A276] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Warm chocolate with flame accent */}
        <div className="bg-[#583101] text-[#FFFDF9] px-5 py-4 flex items-center justify-between border-b border-[#D4A276]/40 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#8B4513] border border-amber-300/40 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A276] block leading-none mb-0.5">
                Host Grocer In-Store Deals
              </span>
              <h2
                id="specials-modal-title"
                className="font-serif font-bold text-base sm:text-lg text-white truncate leading-tight"
              >
                {storeName} Daily Specials
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenStoreDashboard && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStoreDashboard();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Post new specials in Store Dashboard"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Special</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFDF9] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Department Filter Bar */}
        <div className="bg-[#FFF0DE] border-b border-[#D4A276]/60 px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#8B5E34] mr-1 shrink-0">
            Filter:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedDept === dept
                  ? 'bg-[#583101] text-amber-100 shadow-2xs font-bold'
                  : 'bg-white/80 text-[#583101] hover:bg-white border border-[#D4A276]/50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Specials Content Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSpecials.map((special) => (
              <div
                key={special.id}
                className="bg-white rounded-2xl border-2 border-[#D4A276]/70 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#8B4513] transition-all group"
              >
                <div>
                  {/* Photo & Ribbons */}
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    <img
                      src={special.imageUrl}
                      alt={special.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-[#583101]/90 backdrop-blur-xs text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {special.department}
                    </div>
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                      <span>{special.badgeText}</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-sm text-[#583101] leading-snug group-hover:text-[#8B4513]">
                      {special.title}
                    </h3>
                    <p className="text-xs text-[#8B5E34] leading-relaxed line-clamp-2">
                      {special.description}
                    </p>

                    <div className="flex items-baseline gap-2 pt-1 border-t border-stone-100">
                      <span className="font-mono font-bold text-lg text-[#8B4513]">
                        {special.specialPrice}
                      </span>
                      {special.regularPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {special.regularPrice}
                        </span>
                      )}
                      <span className="text-[10px] text-[#8B5E34] ml-auto font-medium">
                        Valid: {special.validUntil}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="px-4 py-2 bg-[#FFFDF9] border-t border-[#D4A276]/40 flex items-center justify-between text-[11px] text-[#8B5E34]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fresh In Store</span>
                  </span>
                  <span className="font-semibold text-stone-600">
                    Ask at checkout counter
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Store Manager Callout Banner */}
          <div className="bg-gradient-to-r from-[#FFF0DE] to-[#FFF8EE] border-2 border-dashed border-[#D4A276] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-[#583101] text-amber-100 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#583101]">
                  Are you {storeName} Store Management?
                </h4>
                <p className="text-xs text-[#8B5E34] mt-0.5">
                  Update today&apos;s specials, post flash deals, and monitor your 65% revenue share in your Store Dashboard.
                </p>
              </div>
            </div>

            {onOpenStoreDashboard && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStoreDashboard();
                }}
                className="px-4 py-2 bg-[#8B4513] hover:bg-[#72370E] text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Open Store Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FFF8EE] border-t border-[#D4A276]/50 px-5 py-3 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-[#8B5E34]">
            {filteredSpecials.length} active specials currently live on this display
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#583101] hover:bg-[#6F4518] text-[#FFFDF9] text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
