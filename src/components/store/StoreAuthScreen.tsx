import React, { useState } from 'react';
import { Store, KeyRound, Lock, ArrowRight, ShieldCheck, CheckCircle2, Tv, Sparkles, UserCheck } from 'lucide-react';
import { INITIAL_STORES, type StorePartner } from '../../data/boardsData';

interface StoreAuthScreenProps {
  onLoginSuccess: (store: StorePartner) => void;
  onExitToKiosk: () => void;
  onExitToSuperAdmin: () => void;
  initialStoreId?: string;
}

export const StoreAuthScreen: React.FC<StoreAuthScreenProps> = ({
  onLoginSuccess,
  onExitToKiosk,
  onExitToSuperAdmin,
  initialStoreId = 'salam-lv',
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(initialStoreId);
  const [pinCode, setPinCode] = useState<string>('7702');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundStore = INITIAL_STORES.find((s) => s.id === selectedStoreId);
    if (!foundStore) {
      setErrorMessage('Selected store not found in partner registry.');
      return;
    }
    // Accept standard or default pin
    if (pinCode.length < 4) {
      setErrorMessage('Please enter your 4-digit Store Manager PIN.');
      return;
    }
    onLoginSuccess(foundStore);
  };

  const handleQuickDemoLogin = (storeId: string) => {
    const foundStore = INITIAL_STORES.find((s) => s.id === storeId);
    if (foundStore) {
      setSelectedStoreId(storeId);
      setPinCode('7702');
      onLoginSuccess(foundStore);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1609] via-[#4A2600] to-[#1F1005] flex items-center justify-center p-4 selection:bg-amber-400 selection:text-stone-900 font-sans">
      <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl shadow-2xl border-4 border-[#8B4513] overflow-hidden my-auto animate-fade-in flex flex-col">
        {/* Top Header */}
        <div className="bg-[#3D2314] px-6 py-6 text-amber-100 border-b border-[#5A3825] flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-[#8B4513] border-2 border-amber-300/40 flex items-center justify-center text-white shadow-lg mb-3">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-serif font-bold text-amber-50">
            Host Grocer Merchant Portal
          </h2>
          <p className="text-xs text-amber-300/80 mt-1 max-w-xs">
            Authenticate to manage store displays, monitor 65% revenue share, and publish daily store specials.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-7 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Store Selection */}
            <div>
              <label className="block text-stone-700 font-bold mb-1.5 flex items-center justify-between">
                <span>Select Your Partner Store:</span>
                <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider">
                  Verified Merchant
                </span>
              </label>
              <div className="relative">
                <select
                  value={selectedStoreId}
                  onChange={(e) => {
                    setSelectedStoreId(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-bold text-xs sm:text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  {INITIAL_STORES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}, {s.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Merchant PIN */}
            <div>
              <label className="block text-stone-700 font-bold mb-1.5 flex items-center justify-between">
                <span>Store Manager 4-Digit PIN:</span>
                <span className="text-[10px] text-stone-400 font-mono">Demo: 7702</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter 4-digit PIN"
                  className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl pl-10 pr-3.5 py-2.5 text-stone-900 font-mono font-bold tracking-widest text-sm focus:border-amber-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#8B4513] hover:bg-[#72370E] active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Access Store Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Presets for Instant Evaluation */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2 text-center">
              Quick 1-Click Merchant Login:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('salam-lv')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-950 font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#8B4513] shrink-0" />
                <div className="truncate">
                  <span className="block truncate font-bold text-[11px]">Salam Market</span>
                  <span className="text-[10px] text-stone-500 block">Las Vegas (Flagship)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('habesha-la')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-950 font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#8B4513] shrink-0" />
                <div className="truncate">
                  <span className="block truncate font-bold text-[11px]">Habesha Market</span>
                  <span className="text-[10px] text-stone-500 block">Los Angeles, CA</span>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation alternatives */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-200">
            <button
              onClick={onExitToKiosk}
              className="text-[#8B4513] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Back to In-Store Corkboard</span>
            </button>

            <button
              onClick={onExitToSuperAdmin}
              className="text-stone-500 hover:text-stone-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
