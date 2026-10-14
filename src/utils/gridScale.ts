import { TV_SCREEN_PROFILES, type TileGridSize, type TVProfile } from '../data/findingsData';

export interface TileUnitBreakdown {
  colUnits: number;
  rowUnits: number;
}

export interface DynamicTileScaleResult {
  tileUnit: TileGridSize;
  colSpan: number;
  rowSpan: number;
  // Raw percentage based on column fraction: (colSpan / totalColumns) * 100
  nominalPercentage: number;
  nominalPercentageStr: string;
  // Exact percentage accounting for gap: (exactWidthPx / containerWidth) * 100
  exactPercentage: number;
  exactPercentageStr: string;
  // Exact pixel dimensions computed for the specific container width
  exactWidthPx: number;
  estimatedHeightPx: number;
  // CSS calc expression for fluid CSS Grid / flex child
  cssCalcWidth: string;
  // Ready-to-apply React CSS properties
  cssGridStyle: React.CSSProperties;
  // Comparison across standard TV sizes (55", 65", 75", 85", 98")
  tvScalings: Record<'55' | '65' | '75' | '85' | '98', { columns: number; percentageStr: string; exactWidthPx: number }>;
}

export interface TileScaleOptions {
  tileUnit: TileGridSize | string;
  containerWidth: number; // in pixels
  selectedTvProfileId?: 'auto' | '55' | '65' | '75' | '85' | '98';
  totalColumns?: number; // optional override
  gapPx?: number; // default 12px
  baseUnitHeightPx?: number; // default 140px
}

/**
 * Parses tile unit string into numeric column and row units.
 * Supports authorized units: '1x1', '2x1', '2x2', '3x1'.
 */
export const parseTileUnits = (unitStr: TileGridSize | string | undefined): TileUnitBreakdown => {
  if (!unitStr) return { colUnits: 1, rowUnits: 1 };
  const normalized = unitStr.toLowerCase().trim();
  if (normalized === '2x2') return { colUnits: 2, rowUnits: 2 };
  if (normalized === '3x1') return { colUnits: 3, rowUnits: 1 };
  if (normalized === '2x1') return { colUnits: 2, rowUnits: 1 };
  return { colUnits: 1, rowUnits: 1 };
};

/**
 * Resolves column count for a given TV profile or container width.
 * Standard landscape layout follows a 7-column grid.
 */
export const getTVProfileColumnCount = (
  tvProfileId: 'auto' | '55' | '65' | '75' | '85' | '98' = 'auto',
  containerWidth: number = 1920
): number => {
  // All standardized profiles adhere to the 7-column landscape board architecture
  if (tvProfileId === '55' || tvProfileId === '65' || tvProfileId === '75' || tvProfileId === '85' || tvProfileId === '98') {
    return 7;
  }
  return 7;
};

/**
 * Translates proposed tile units (1x1, 2x1, 3x1) into dynamic CSS Grid percentages
 * based on the container width, ensuring the layout remains consistent across different TV screen sizes.
 *
 * Mathematical model:
 * Container Width W, Total Columns N, Grid Gap G.
 * Single Column Width C = (W - (N - 1) * G) / N
 * Width for tile spanning k columns:
 * Tile Width T_k = k * C + (k - 1) * G
 *                = k * ((W - (N - 1) * G) / N) + (k - 1) * G
 *
 * Dynamic CSS Grid Percentage P = (T_k / W) * 100%
 */
export const calculateTileGridPercentages = (options: TileScaleOptions): DynamicTileScaleResult => {
  const {
    tileUnit,
    containerWidth,
    selectedTvProfileId = 'auto',
    gapPx = 12,
    baseUnitHeightPx = 140,
  } = options;

  const validUnit: TileGridSize = (tileUnit as TileGridSize) || '1x1';
  const { colUnits, rowUnits } = parseTileUnits(validUnit);

  const totalColumns = options.totalColumns || getTVProfileColumnCount(selectedTvProfileId, containerWidth);
  const safeColumns = Math.max(1, totalColumns);
  const safeContainerWidth = Math.max(320, containerWidth);

  // Column width taking gaps into account
  const totalGapsWidth = (safeColumns - 1) * gapPx;
  const availableContentWidth = Math.max(0, safeContainerWidth - totalGapsWidth);
  const singleColWidth = availableContentWidth / safeColumns;

  // Exact tile pixel width
  const exactWidthPx = Math.round(colUnits * singleColWidth + (colUnits - 1) * gapPx);
  const estimatedHeightPx = Math.round(rowUnits * baseUnitHeightPx + (rowUnits - 1) * gapPx);

  // Nominal percentage: (colUnits / safeColumns) * 100
  const nominalPercentage = (colUnits / safeColumns) * 100;
  const nominalPercentageStr = `${nominalPercentage.toFixed(1)}%`;

  // Exact percentage of the actual container: (exactWidthPx / safeContainerWidth) * 100
  const exactPercentage = (exactWidthPx / safeContainerWidth) * 100;
  const exactPercentageStr = `${exactPercentage.toFixed(1)}%`;

  // Dynamic CSS calc formula
  const cssCalcWidth = `calc(${colUnits} * ((100% - ${totalGapsWidth}px) / ${safeColumns}) + ${(colUnits - 1) * gapPx}px)`;

  // React CSS Grid Style
  const cssGridStyle: React.CSSProperties = {
    gridColumn: `span ${colUnits}`,
    gridRow: `span ${rowUnits}`,
    // Optional width constraints for strict consistency
    minWidth: 0, // prevents grid item blowup
  };

  // Cross-TV scaling comparison
  const tvScalings: Record<'55' | '65' | '75' | '85' | '98', { columns: number; percentageStr: string; exactWidthPx: number }> = {
    '55': computeForProfile(colUnits, 10, safeContainerWidth, gapPx),
    '65': computeForProfile(colUnits, 12, safeContainerWidth, gapPx),
    '75': computeForProfile(colUnits, 14, safeContainerWidth, gapPx),
    '85': computeForProfile(colUnits, 16, safeContainerWidth, gapPx),
    '98': computeForProfile(colUnits, 18, safeContainerWidth, gapPx),
  };

  return {
    tileUnit: validUnit,
    colSpan: colUnits,
    rowSpan: rowUnits,
    nominalPercentage,
    nominalPercentageStr,
    exactPercentage,
    exactPercentageStr,
    exactWidthPx,
    estimatedHeightPx,
    cssCalcWidth,
    cssGridStyle,
    tvScalings,
  };
};

function computeForProfile(
  colUnits: number,
  cols: number,
  containerW: number,
  gap: number
): { columns: number; percentageStr: string; exactWidthPx: number } {
  const gaps = (cols - 1) * gap;
  const colW = Math.max(0, containerW - gaps) / cols;
  const exactW = Math.round(colUnits * colW + (colUnits - 1) * gap);
  const pct = ((colUnits / cols) * 100).toFixed(1);
  return {
    columns: cols,
    percentageStr: `${pct}%`,
    exactWidthPx: exactW,
  };
}

/**
 * Standard relative grid matrix reference table.
 * Strictly configured with authorized relative units:
 * - 1×1 (10″ × 10″): Standard square advertisement
 * - 2×1 (20″ × 10″): Wide promotional advertisement positioned toward the center-left
 * - 2×2 (20″ × 20″): Large featured advertisement positioned at the top-left
 * - 3×1 (30″ × 10″): Wide promotional advertisement positioned toward the center-right
 */
export const STANDARD_RELATIVE_TILES: {
  size: TileGridSize;
  label: string;
  description: string;
  exampleAd: string;
}[] = [
  { size: '1x1', label: 'Standard Square (1×1 · 10″×10″)', description: 'Standard square advertisement (Roommate, Guitar, Sofa, Cashier)', exampleAd: 'Roommate Wanted ($700/mo)' },
  { size: '2x1', label: 'Wide Promotional Ad (2×1 · 20″×10″)', description: 'Wide promotional advertisement positioned toward center-left', exampleAd: 'Apartment for Rent · 2 bed / 2 bath near UNLV ($1,450/mo)' },
  { size: '2x2', label: 'Large Featured Ad (2×2 · 20″×20″)', description: 'Large featured advertisement positioned at top-left', exampleAd: 'Upcoming Ethiopian Concert – Music · Culture · Community' },
  { size: '3x1', label: 'Wide Promotional Ad (3×1 · 30″×10″)', description: 'Wide promotional advertisement positioned toward center-right', exampleAd: 'Toyota Camry 2019 ($12,500) / Store Special' },
];
