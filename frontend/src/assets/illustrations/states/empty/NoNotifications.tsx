import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoNotifications: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada notifikasi">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Bell */}
      <path d="M100 50a4 4 0 014 4c0 8 4 14 6 18a4 4 0 01-3 6H93a4 4 0 01-3-6c2-4 6-10 6-18a4 4 0 014-4z" fill="none" stroke={slate} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M96 78a4 4 0 008 0" stroke={slate} strokeWidth="1.5" strokeLinecap="round" />
      {/* Bell top */}
      <circle cx="100" cy="46" r="3" fill={slate} opacity="0.4" />
      {/* Notification dot */}
      <circle cx="118" cy="52" r="6" fill={gold} opacity="0.3" />
      <line x1="75" y1="140" x2="125" y2="140" stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
    </svg>
  );
};
