export type IllustrationSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ThemeVariant = 'light' | 'dark';

export interface IllustrationProps {
  className?: string;
  size?: IllustrationSize;
  variant?: ThemeVariant;
  animated?: boolean;
}

export const sizeMap: Record<IllustrationSize, { width: number; height: number }> = {
  sm: { width: 120, height: 90 },
  md: { width: 200, height: 150 },
  lg: { width: 320, height: 240 },
  xl: { width: 400, height: 300 },
  full: { width: 480, height: 360 },
};

export const stateSizeMap: Record<IllustrationSize, { width: number; height: number }> = {
  sm: { width: 80, height: 80 },
  md: { width: 140, height: 140 },
  lg: { width: 200, height: 200 },
  xl: { width: 260, height: 260 },
  full: { width: 320, height: 320 },
};
