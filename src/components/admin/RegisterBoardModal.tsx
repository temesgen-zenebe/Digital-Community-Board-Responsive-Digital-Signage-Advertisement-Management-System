import React, { useState } from 'react';
import { X, Tv, Monitor, MapPin, Store, Check, Sparkles, Shield, Clock, Wifi } from 'lucide-react';
import { TV_SCREEN_PROFILES } from '../../data/findingsData';
import { type StorePartner, type BoardHardwareConfig } from '../../data/boardsData';

interface RegisterBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StorePartner[];
  onRegisterBoard: (newBoard: BoardHardwareConfig) => void;
  defaultStoreId?: string;
}

export const RegisterBoardModal: React.FC<RegisterBoardModalProps> = ({
  isOpen,
  onClose,
  stores,
  onRegisterBoard,
  defaultStoreId,
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    defaultStoreId || stores[0]?.id || 'salam-lv'
  );
  const [locationInStore, setLocationInStore] = useState<string>('Front Entrance & Cashier Line');
  const [screenProfileId, setScreenProfileId] = useState<'55' | '65' | '75' | '85' | '98' | 'auto'>('75');
  const [slideIntervalSec, setSlideIntervalSec] = useState<number>(10);
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.110');

  if (!isOpen) return null;

  const currentStore = stores.find((s) => s.id === selectedStoreId) || stores[0];
  const selectedProfile = TV_SCREEN_PROFILES.find((p) => p.id === screenProfileId) || TV_SCREEN_PROFILES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStore) return;

    // Generate smart Board ID based on store prefix
    const storeInitials = currentStore.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
    const statePrefix = currentStore.state.toUpperCase();
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const newBoardId = `${storeInitials}-${statePrefix}-${randomSeq}`;

    const newBoard: BoardHardwareConfig = {
      id: newBoardId,
      storeId: currentStore.id,
      storeName: `${currentStore.name} — ${currentStore.city}`,
      storeCity: currentStore.city,
      storeState: currentStore.state,
      storeAddress: `${currentStore.address}, ${currentStore.city}, ${currentStore.state} ${currentStore.zipCode}`,
      locationInStore,
      screenProfileId,
      screenDiagonal: selectedProfile.label,
      resolution: '3840 × 2160 (16:9 Landscape)',
      slideIntervalSec,
      status: 'Online',
      ipAddress: ipAddress || '192.168.1.110',
      macAddress: `D4:${Math.floor(10 + Math.random() * 89)}:39:B2:${Math.floor(10 + Math.random() * 89)}:01`,
      lastSync: 'Just now',
      uptimePercent: 100.0,
      installedDate: 'Today',
      currentSlide: 1,
      totalSlides: 3,
      activePinsCount: 15,
      dailyImpressions: 3200,
      firmwareVersion: 'v4.2.8-corkboard-lts',
      wifiSignal: '-45 dBm (Excellent)',
    };

    onRegisterBoard(newBoard);
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
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-50">
                Register & Provision New Board Screen
              </h3>
              <p className="text-[11px] text-amber-300/80">
                Super Admin Fleet Management · Digital Bulletin Board OTA Provisioning
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
          {/* Target Store Selection */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Host Partner Store:
            </label>
            <div className="relative">
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city}, {s.state}) — {s.address}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Physical Location inside Store */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Physical Screen Placement in Store:
            </label>
            <input
              type="text"
              required
              value={locationInStore}
              onChange={(e) => setLocationInStore(e.target.value)}
              placeholder="e.g. Front Entrance, Butcher Counter, Aisle 2 Spices, Dining Hall"
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <p className="text-[10px] text-stone-500 mt-0.5">
              Identifies the physical TV screen mounting area for shoppers and merchants.
            </p>
          </div>

          {/* Screen Hardware Profile */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1.5">
              Commercial Television Display Profile:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TV_SCREEN_PROFILES.filter((p) => p.id !== 'auto').map((p) => {
                const isSelected = screenProfileId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setScreenProfileId(p.id)}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      isSelected
                        ? 'bg-[#8B4513] text-white border-amber-500 ring-2 ring-amber-400/30'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{p.diagonalInches}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </div>
                    <div className="text-[10px] opacity-80">{p.physicalDimensions}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rotation Speed & IP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Slide Rotation Speed:
              </label>
              <div className="flex gap-1.5">
                {[5, 10, 15, 20, 30].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSlideIntervalSec(sec)}
                    className={`flex-1 py-1.5 rounded text-center font-mono font-bold text-xs transition-colors ${
                      slideIntervalSec === sec
                        ? 'bg-[#8B4513] text-white border border-amber-600'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Device Local IP / Hostname:
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.110"
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-stone-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Info callout */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Instant Over-The-Air Provisioning:</span> Once registered,
              the digital corkboard kiosk client will immediately synchronize real community listings,
              standardized 30px QR codes, and pushpin card layouts.
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
              <span>Register & Provision Board</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
