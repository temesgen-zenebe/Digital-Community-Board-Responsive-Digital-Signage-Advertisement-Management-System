import React from 'react';
import { DigitalCorkboardKiosk } from './kiosk/DigitalCorkboardKiosk';

interface CorkboardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorkboardPreviewModal: React.FC<CorkboardPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in overflow-hidden">
      <DigitalCorkboardKiosk
        onExitFullscreen={onClose}
        isEmbedded={false}
      />
    </div>
  );
};
