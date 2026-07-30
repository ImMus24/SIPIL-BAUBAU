import React from 'react';
import type { IllustrationProps } from '../../types';

export const AbstractShapes: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const gold = '#facc15';
  const emerald = '#10b981';

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
    >
      {/* Abstract floating shapes */}
      <circle cx="60" cy="50" r="30" fill={blue} opacity="0.04" />
      <circle cx="60" cy="50" r="20" fill={blue} opacity="0.03" />

      <rect x="320" y="200" width="40" height="40" rx="8" fill={gold} opacity="0.04" transform="rotate(15 340 220)" />
      <rect x="330" y="210" width="20" height="20" rx="4" fill={gold} opacity="0.03" transform="rotate(15 340 220)" />

      <polygon points="350,50 370,80 330,80" fill={emerald} opacity="0.04" />

      <circle cx="200" cy="260" r="50" fill={blue} opacity="0.03" />
      <circle cx="200" cy="260" r="30" fill={gold} opacity="0.02" />

      <rect x="20" y="240" width="60" height="6" rx="3" fill={blue} opacity="0.04" />
      <rect x="320" y="100" width="6" height="40" rx="3" fill={emerald} opacity="0.04" />
    </svg>
  );
};
