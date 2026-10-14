import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export interface QRCodeCanvasProps {
  value: string;
  size?: number;
  className?: string;
  canvasClassName?: string;
  darkColor?: string;
  lightColor?: string;
  ariaLabel?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export const QRCodeCanvas: React.FC<QRCodeCanvasProps> = ({
  value,
  size = 30,
  className = '',
  canvasClassName = '',
  darkColor = '#24140A',
  lightColor = '#FFFFFF',
  ariaLabel = 'Scan QR code to access pin on mobile',
  errorCorrectionLevel = 'L',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    // Use a crisp, high internal render resolution (at least 240px, or 3x displayed size)
    // to ensure razor-sharp edges on Retina screens, smartphones, and large TV displays
    const renderResolution = Math.max(240, Math.round(size * 3));

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: renderResolution,
        margin: 1, // Compact clean quiet zone gives maximum size to modules
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel,
      },
      (error) => {
        if (error) {
          console.error('Error generating QR code', error);
        }
      }
    );
  }, [value, size, darkColor, lightColor, errorCorrectionLevel]);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size ? `${size}px` : '100%',
        height: size ? `${size}px` : '100%',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full aspect-square object-contain rounded-xs ${canvasClassName}`}
        style={{ imageRendering: 'pixelated' }}
        title={ariaLabel}
        aria-label={ariaLabel}
      />
    </div>
  );
};
