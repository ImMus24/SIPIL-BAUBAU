import React from 'react';
import type { IllustrationProps } from '../../types';

export const ProfileUpdated: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Profil berhasil diperbarui">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.5" />
      {/* Profile avatar */}
      <circle cx="100" cy="82" r="24" fill="none" stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      <circle cx="100" cy="75" r="8" fill={slate} opacity="0.15" />
      <ellipse cx="100" cy="92" rx="14" ry="8" fill={slate} opacity="0.1" />
      {/* Edit pencil */}
      <g transform="translate(130, 65)">
        <path d="M-6 8l14-14a1.5 1.5 0 012 0l2 2a1.5 1.5 0 010 2L-4 12l-6 2 2-6z" fill={emerald} opacity="0.6" />
      </g>
      {/* Success dot */}
      <circle cx="100" cy="135" r="4" fill={emerald} opacity="0.5" />
      <circle cx="100" cy="135" r="2" fill={emerald} opacity="0.8" />
    </svg>
  );
};
