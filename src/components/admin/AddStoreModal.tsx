import React, { useState } from 'react';
import { X, Store, Check, Building2, MapPin, User, Phone, Mail, DollarSign, Percent } from 'lucide-react';
import { type StorePartner } from '../../data/boardsData';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStore: (store: StorePartner) => void;
}

export const AddStoreModal: React.FC<AddStoreModalProps> = ({
  isOpen,
  onClose,
  onAddStore,
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NV');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [initialScreens, setInitialScreens] = useState<number>(1);
  const [merchantShare, setMerchantShare] = useState<number>(65);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !address) return;

    const storeIdSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16);
    const storeId = `${storeIdSlug}-${city.toLowerCase().slice(0, 3)}`;

    const newStore: StorePartner = {
      id: storeId,
      name,
      city,
      state: state.toUpperCase(),
      address,
      zipCode,
      contactName: contactName || 'Store Manager',
      contactPhone: contactPhone || '702-555-0100',
      contactEmail: contactEmail || `manager@${storeIdSlug}.com`,
      joinedDate: 'Oct 2026',
      screenCount: initialScreens,
      activeBoardIds: [`${storeId.slice(0, 2).toUpperCase()}-${state.toUpperCase()}-001`],
      totalMonthlyRevenue: 3500,
      merchantSharePercentage: merchantShare,
      merchantPayoutAmount: Math.round(3500 * (merchantShare / 100)),
      payoutStatus: 'Pending',
      status: 'Active',
    };

    onAddStore(newStore);
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
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-50">
                Onboard New Partner Grocery Store
              </h3>
              <p className="text-[11px] text-amber-300/80">
                Super Admin Store Management · Host Grocer Network
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
          {/* Store Name */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Store & Merchant Brand Name:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Merkato Supermarket, Axum Halal Grocers"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Address fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-stone-700 font-semibold mb-1">
                Street Address:
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="4200 Commercial Way"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                City:
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Las Vegas"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                State (2-Letter):
              </label>
              <input
                type="text"
                maxLength={2}
                required
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="NV"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 uppercase font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Zip Code:
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="89103"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="border-t border-stone-200 pt-3">
            <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-800" />
              <span>Host Store Manager & Merchant Payout Contact</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Manager Name:
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Kassahun M."
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Phone Number:
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="702-555-0199"
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="store@merkatomart.com"
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Business Terms: Revenue Share & Screens */}
          <div className="grid grid-cols-2 gap-3 border-t border-stone-200 pt-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Host Grocer Revenue Share:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={50}
                  max={80}
                  value={merchantShare}
                  onChange={(e) => setMerchantShare(Number(e.target.value))}
                  className="w-24 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-900 font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-stone-600 font-semibold">% (Standard 65%)</span>
              </div>
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Initial Board Screens:
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setInitialScreens(num)}
                    className={`flex-1 py-1.5 rounded text-center font-bold transition-colors ${
                      initialScreens === num
                        ? 'bg-[#8B4513] text-white border border-amber-600'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {num} {num === 1 ? 'Screen' : 'Screens'}
                  </button>
                ))}
              </div>
            </div>
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
              <span>Add Partner Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
