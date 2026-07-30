import React from 'react';
import type { IllustrationProps } from '../../types';

export const GridPattern: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const slate = isDark ? '#94a3b8' : '#64748b';

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <pattern id="gridPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={slate} strokeWidth="0.5" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridPattern)" />
    </svg>
  );
};
