import React from 'react';
import { DigitalCorkboardKiosk, type BoardDisplayConfig } from './kiosk/DigitalCorkboardKiosk';
import { type ListingCardItem } from '../data/findingsData';

interface CorkboardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardConfig?: BoardDisplayConfig;
  initialSlideInterval?: number;
  onOpenStoreDashboard?: () => void;
  onOpenManageList?: (boardId: string) => void;
  allListings?: ListingCardItem[];
}

export const CorkboardPreviewModal: React.FC<CorkboardPreviewModalProps> = ({
  isOpen,
  onClose,
  boardConfig,
  initialSlideInterval = 10,
  onOpenStoreDashboard,
  onOpenManageList,
  allListings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in overflow-hidden">
      <DigitalCorkboardKiosk
        onExitFullscreen={onClose}
        isEmbedded={false}
        boardConfig={boardConfig}
        initialSlideInterval={initialSlideInterval}
        onOpenStoreDashboard={onOpenStoreDashboard}
        onOpenManageList={onOpenManageList}
        allListings={allListings}
      />
    </div>
  );
};
