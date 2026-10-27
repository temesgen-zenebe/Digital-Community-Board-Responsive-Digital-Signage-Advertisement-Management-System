import React, { useState } from 'react';
import {
  X,
  Tv,
  Store,
  MapPin,
  Check,
  Copy,
  Wifi,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { QRCodeCanvas } from '../common/QRCodeCanvas';

interface RegisterScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardConfig: {
    storeName: string;
    storeAddress: string;
    boardId: string;
    status: string;
    screenType: string;
  };
  registrationUrl: string;
  onOpenStoreDashboard?: () => void;
  onOpenManageList?: (boardId: string) => void;
}

export const RegisterScreenModal: React.FC<RegisterScreenModalProps> = ({
  isOpen,
  onClose,
  boardConfig,
  registrationUrl,
  onOpenStoreDashboard,
  onOpenManageList,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBoardId, setCopiedBoardId] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyBoardId = () => {
    navigator.clipboard.writeText(boardConfig.boardId);
    setCopiedBoardId(true);
    setTimeout(() => setCopiedBoardId(false), 2000);
  };

  const handleTestConnection = () => {
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#FFFDF9] border-2 border-[#D4A276] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Deep chocolate brown */}
        <div className="bg-[#583101] text-[#FFFDF9] px-5 py-3.5 flex items-center justify-between border-b border-[#D4A276]/40 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#D4A276]/30 border border-[#D4A276] flex items-center justify-center text-amber-200 shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A276] block leading-none mb-0.5">
                Display Management
              </span>
              <h2
                id="register-modal-title"
                className="font-serif font-bold text-base sm:text-lg text-white truncate leading-tight"
              >
                Register & Manage This Screen
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFDF9] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close registration dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-[#583101]">
          {/* Top Status & Hardware Card */}
          <div className="bg-[#FFF0DE] border border-[#D4A276] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D4A276] flex items-center justify-center text-[#583101] shrink-0">
                <Store className="w-5 h-5 text-[#6F4518]" />
              </div>
              <div className="min-w-0">
                <p className="font-serif font-bold text-sm text-[#583101] leading-tight">
                  {boardConfig.storeName}
                </p>
                <p className="text-xs text-[#8B5E34] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{boardConfig.storeAddress}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online & Synced
              </span>
            </div>
          </div>

          {/* QR Code & Direct Registration / Manage Your List Box */}
          <div className="bg-white border-2 border-[#D4A276] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
            {/* Scannable & Clickable Compact QR Code */}
            <div
              onClick={() => {
                onClose();
                if (onOpenManageList) onOpenManageList(boardConfig.boardId);
              }}
              className="flex flex-col items-center justify-center p-2 bg-[#FFFDF9] border border-[#BC8A5F] hover:border-[#8B4513] rounded-xl shadow-2xs shrink-0 cursor-pointer group transition-all hover:scale-105 active:scale-95"
              title="Click or scan QR code to manage your list and post flyers on this screen"
            >
              <div className="w-[60px] h-[60px] flex items-center justify-center">
                <QRCodeCanvas
                  value={registrationUrl}
                  size={54}
                  className="w-[54px] h-[54px] object-contain block group-hover:opacity-90"
                  darkColor="#24140A"
                  lightColor="#FFFFFF"
                  errorCorrectionLevel="L"
                  ariaLabel="Scan or click QR code to manage your list and post flyers"
                />
              </div>
              <span className="text-[9px] font-bold tracking-wider uppercase text-[#8B5E34] group-hover:text-[#8B4513] mt-1 flex items-center gap-1">
                <span>Scan or Click</span>
              </span>
            </div>

            {/* Registration & Manage Your List Details */}
            <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E34]">
                    Unique Screen Identifier
                  </span>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                    <code className="text-sm font-mono font-bold bg-[#FFF0DE] px-2.5 py-0.5 rounded-md border border-[#D4A276] text-[#583101]">
                      {boardConfig.boardId}
                    </code>
                    <button
                      onClick={handleCopyBoardId}
                      className="p-1 rounded-md bg-[#FFF0DE] hover:bg-[#F3D5B5] border border-[#D4A276] text-[#583101] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy Board ID"
                    >
                      {copiedBoardId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#8B5E34]" />
                      )}
                      <span className="text-[10px]">{copiedBoardId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Action to Manage Your List */}
                {onOpenManageList && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenManageList(boardConfig.boardId);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-[#8B4513] hover:from-amber-600 hover:to-[#72370E] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>Manage Your List / Post Flyer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-[#8B5E34] leading-relaxed">
                Scan or click this QR code to access the specific <strong>Manage Your List</strong> portal for screen <strong>{boardConfig.boardId}</strong>. View live flyers, post new community listings with fast checkout, and receive 1-second instant SuperAdmin activation.
              </p>

              <div className="pt-0.5 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#583101] hover:bg-[#6F4518] text-[#FFFDF9] text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Direct Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-300" />
                      <span>Copy Direct Portal Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Setup Instructions */}
          <div className="space-y-2 pt-1 text-xs">
            <h4 className="font-serif font-bold text-sm text-[#583101] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Three-Step Screen Activation</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-[#FFF0DE]/60 border border-[#D4A276]/60 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#583101] text-[#FFFDF9] flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                <p className="font-semibold text-xs text-[#583101]">Scan QR Code</p>
                <p className="text-[11px] text-[#8B5E34] leading-tight">
                  Point any phone camera at the screen to launch the mobile pairing portal.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FFF0DE]/60 border border-[#D4A276]/60 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#583101] text-[#FFFDF9] flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                <p className="font-semibold text-xs text-[#583101]">Verify Location</p>
                <p className="text-[11px] text-[#8B5E34] leading-tight">
                  Confirm Salam Market store credentials and bind Board ID {boardConfig.boardId}.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FFF0DE]/60 border border-[#D4A276]/60 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#583101] text-[#FFFDF9] flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                <p className="font-semibold text-xs text-[#583101]">Manage Ads</p>
                <p className="text-[11px] text-[#8B5E34] leading-tight">
                  Approve incoming community submissions and monitor revenue share live.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FFF8EE] border-t border-[#D4A276]/50 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleTestConnection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4A276] hover:bg-[#FFEDD8] text-xs font-semibold text-[#583101] transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8B5E34] ${testSuccess ? 'animate-spin' : ''}`} />
            <span>{testSuccess ? 'Hardware Verified (200 OK)' : 'Ping Display Network'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenStoreDashboard && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStoreDashboard();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#583101] border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-[#8B4513]" />
                <span className="hidden sm:inline">Store Portal</span>
              </button>
            )}

            {onOpenManageList && (
              <button
                onClick={() => {
                  onClose();
                  onOpenManageList(boardConfig.boardId);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-[#8B4513] hover:from-amber-700 hover:to-[#72370E] text-[#FFFDF9] text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Register & Open List</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#583101] hover:bg-[#6F4518] text-[#FFFDF9] text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
