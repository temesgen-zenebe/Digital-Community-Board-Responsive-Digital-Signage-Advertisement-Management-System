import React, { useState } from 'react';
import { X, Tag, DollarSign, Phone, Image, Check, Sparkles, AlertCircle } from 'lucide-react';
import { type ListingCardItem, type TileGridSize, getLogicalPlaceholderImage } from '../../data/findingsData';
import { type BoardHardwareConfig } from '../../data/boardsData';

interface AddPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPin: (newPin: ListingCardItem) => void;
  boards: BoardHardwareConfig[];
}

const CATEGORIES = [
  'Housing',
  'Jobs',
  'For Sale',
  'Services',
  'Community',
  'Events',
  'Store Special',
];

export const AddPinModal: React.FC<AddPinModalProps> = ({
  isOpen,
  onClose,
  onAddPin,
  boards,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Services');
  const [details, setDetails] = useState('');
  const [priceOrRate, setPriceOrRate] = useState('');
  const [phone, setPhone] = useState('702-555-0100');
  const [imageUrl, setImageUrl] = useState('');
  const [pinColor, setPinColor] = useState<'red' | 'blue' | 'green' | 'yellow' | 'purple'>('green');
  const [gridSize, setGridSize] = useState<TileGridSize>('1x1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !phone) return;

    const newPin: ListingCardItem = {
      id: `admin-pin-${Date.now()}`,
      title,
      category,
      details: details || 'Community verified listing pinned by store management.',
      priceOrRate: priceOrRate || 'Contact for details',
      phone,
      pinColor,
      imageUrl: imageUrl || getLogicalPlaceholderImage(category, title),
      gridSize,
      featured: gridSize === '2x2',
    };

    onAddPin(newPin);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#FCFAF7] rounded-2xl shadow-2xl border-4 border-[#5A3825] overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-[#3D2314] px-4 py-3 flex items-center justify-between text-amber-100 border-b border-[#5A3825]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-50">
                Post New Community Pin / Advertisement
              </h3>
              <p className="text-[11px] text-amber-300/80">
                Super Admin Content Publishing · Immediate Corkboard Placement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Listing Headline / Ad Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Habesha Catering & Injera Feast"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Price / Rate / Status Badge:
              </label>
              <input
                type="text"
                value={priceOrRate}
                onChange={(e) => setPriceOrRate(e.target.value)}
                placeholder="e.g. $1,450/mo, $20/hr, Free Quote"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & Tile Grid Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Direct Contact Phone (for QR & SMS):
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="702-555-0100"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Corkboard Tile Format:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGridSize('1x1')}
                  className={`flex-1 py-2 rounded text-center font-bold transition-all ${
                    gridSize === '1x1'
                      ? 'bg-[#8B4513] text-white ring-2 ring-amber-500/40'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  1×1 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setGridSize('2x1')}
                  className={`flex-1 py-2 rounded text-center font-bold transition-all ${
                    gridSize === '2x1'
                      ? 'bg-[#8B4513] text-white ring-2 ring-amber-500/40'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  2×1 Wide
                </button>
                <button
                  type="button"
                  onClick={() => setGridSize('2x2')}
                  className={`flex-1 py-2 rounded text-center font-bold transition-all ${
                    gridSize === '2x2'
                      ? 'bg-[#8B4513] text-white ring-2 ring-amber-500/40'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  2×2 Featured
                </button>
              </div>
            </div>
          </div>

          {/* Description details */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Listing Description / Bullet Points:
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Fresh injera, spicy doro wat, veggie combos. Available for weekend family celebrations & church banquets."
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Custom Image URL (Optional — leave blank for auto smart stock photo):
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#8B4513] hover:bg-[#72370E] text-white font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Pin Ad to Corkboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
