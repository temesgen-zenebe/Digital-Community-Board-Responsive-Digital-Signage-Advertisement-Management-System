import React, { useState } from 'react';
import {
  type ListingCardItem,
  getDisplayImage,
  getLogicalPlaceholderImage,
} from '../../data/findingsData';
import {
  X,
  Phone,
  MessageSquare,
  Copy,
  Check,
  Calendar,
  MapPin,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Clock,
  Info,
  Sparkles,
  Share2,
} from 'lucide-react';

interface PinDetailModalProps {
  item: ListingCardItem | null;
  onClose: () => void;
  storeName?: string;
}

export const PinDetailModal: React.FC<PinDetailModalProps> = ({
  item,
  onClose,
  storeName = 'Salam Market Las Vegas',
}) => {
  const [copied, setCopied] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  if (!item) return null;

  const displayImage = getDisplayImage(item);
  const hasUserImage = !!(item.imageUrl && item.imageUrl.trim().length > 0);

  // Generate real mobile deep-link URL that can be scanned by any smartphone camera
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://communityboard.local';
  const mobileDeepLinkUrl = `${currentOrigin}/?pin=${encodeURIComponent(item.id)}&title=${encodeURIComponent(
    item.title
  )}&category=${encodeURIComponent(item.category)}&price=${encodeURIComponent(
    item.priceOrRate
  )}&phone=${encodeURIComponent(item.phone)}`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(item.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const smsLink = `sms:${item.phone}?body=${encodeURIComponent(
    `Hello! I saw your "${item.title}" listing on the community board at ${storeName}. Is it still available?`
  )}`;

  return (
    <div
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#FCFAF7] rounded-2xl shadow-2xl border-4 border-[#5A3825] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-[#3D2314] px-4 py-2.5 flex items-center justify-between text-amber-100 border-b border-[#5A3825] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">📌</span>
            <span className="font-serif font-bold text-xs sm:text-sm text-amber-50">
              Community Board Listing Details
            </span>
            <span className="text-amber-500/60 text-xs">·</span>
            <span className="text-[11px] text-amber-300 font-mono hidden sm:inline">
              Pinned at {storeName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Section: Photo Header + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            {/* Image Preview */}
            <div className="sm:col-span-5 relative rounded-xl overflow-hidden bg-stone-200 border-2 border-[#DAC1A7] shadow-inner aspect-4/3 sm:aspect-auto sm:h-52 group">
              <img
                src={displayImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getLogicalPlaceholderImage(
                    item.category,
                    item.title
                  );
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  {hasUserImage ? '📸 User Photo' : '✨ System Placeholder'}
                </span>
                <span className="bg-amber-900/90 text-amber-200 text-[10px] font-mono px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Title & Core Metadata */}
            <div className="sm:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {item.category}
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base text-stone-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {item.priceOrRate}
                  </span>
                </div>

                <h3
                  id="pin-modal-title"
                  className="text-lg sm:text-xl font-bold font-serif text-[#3D2314] leading-tight mb-2"
                >
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/80 mb-3">
                  {item.details}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified physical listing at {storeName}</span>
              </div>
            </div>
          </div>

          {/* Section 2: DETAILED INSTRUCTIONS TO CONTACT THE OWNER */}
          <div className="bg-[#FFFDF9] rounded-xl p-4 border-2 border-[#D4A373] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8D7C4]">
              <Phone className="w-4 h-4 text-[#8B4513]" />
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#3D2314]">
                Instructions to Contact the Owner
              </h4>
            </div>

            {/* Direct Phone / SMS Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Call Button */}
              <a
                href={`tel:${item.phone}`}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#5A3825] hover:bg-[#472B1C] text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Call {item.phone}</span>
              </a>

              {/* Text / SMS Button */}
              <a
                href={smsLink}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#2E7D32] hover:bg-[#256629] text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-emerald-200" />
                <span>Send SMS Message</span>
              </a>
            </div>

            {/* Copy Number Row */}
            <div className="flex items-center justify-between bg-stone-100/80 px-3 py-2 rounded-lg border border-stone-200 text-xs">
              <span className="font-mono font-bold text-stone-900 text-sm">
                📞 {item.phone}
              </span>
              <button
                onClick={handleCopyPhone}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Copy Phone</span>
                  </>
                )}
              </button>
            </div>

            {/* Detailed Instructions list */}
            <div className="space-y-1.5 text-xs text-stone-700 pt-1">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>What to mention:</strong> When calling or texting, introduce yourself and mention you found their flyer pinned on the{' '}
                  <strong>{storeName} Community Board</strong> to reference the {item.priceOrRate} rate.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Recommended hours:</strong> Best time to call is Monday through Saturday, between <strong>9:00 AM – 8:00 PM</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Safety guidelines:</strong> For in-person viewings or pickups, we recommend meeting during daylight hours at {storeName} or nearby public areas.
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: MOBILE ACCESS & SHARING (QR code removed from detail page as not required) */}
          <div className="bg-[#FAF3E8] rounded-xl p-4 border-2 border-[#C29B6C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-amber-900">
                <Share2 className="w-4 h-4 text-[#8B4513]" />
                <span>Take this bulletin listing with you</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Save this listing URL, copy direct link, or preview mobile view for quick reference on your device.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-xs shrink-0">
              <button
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-[#5A3825] font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                <span>{showMobilePreview ? 'Hide Mobile Simulation' : 'Preview Mobile View'}</span>
              </button>
              <a
                href={mobileDeepLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#5A3825] hover:bg-[#472B1C] text-amber-100 font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Direct Mobile Link</span>
                <ExternalLink className="w-3 h-3 text-amber-300" />
              </a>
            </div>
          </div>

          {/* Simulated Mobile Device Preview (If Toggled) */}
          {showMobilePreview && (
            <div className="p-3 bg-stone-900 rounded-xl text-white text-xs animate-fade-in border border-stone-700">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
                <span className="font-mono text-stone-400 text-[10px]">
                  📱 Mobile Web Client Simulation
                </span>
                <span className="text-emerald-400 text-[10px]">● Connected</span>
              </div>
              <div className="bg-stone-800 p-2.5 rounded-lg space-y-1">
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-stone-300 text-xs">{item.details}</p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${item.phone}`}
                    className="bg-emerald-600 px-3 py-1 rounded text-white text-[11px] font-bold"
                  >
                    📞 Call Now
                  </a>
                  <a
                    href={smsLink}
                    className="bg-sky-600 px-3 py-1 rounded text-white text-[11px] font-bold"
                  >
                    💬 Message
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] px-4 py-3 border-t border-[#DAC1A7] flex items-center justify-between text-xs text-stone-600 shrink-0">
          <span>Tear-off Phone: <strong className="font-mono text-stone-900">{item.phone}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#5A3825] hover:bg-[#472B1C] text-white font-medium transition-colors"
          >
            Back to Corkboard
          </button>
        </div>
      </div>
    </div>
  );
};
