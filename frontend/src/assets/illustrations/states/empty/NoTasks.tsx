import React from 'react';
import type { IllustrationProps } from '../../types';

export const NoTasks: React.FC<IllustrationProps> = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const slate = isDark ? '#94a3b8' : '#64748b';
  const card = isDark ? '#1e293b' : '#ffffff';
  const emerald = '#10b981';

  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tidak ada tugas">
      <circle cx="100" cy="100" r="80" fill={blueLight} opacity="0.3" />
      {/* Clipboard */}
      <rect x="70" y="50" width="60" height="75" rx="6" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.3" />
      <rect x="70" y="50" width="60" height="18" rx="6" fill={slate} opacity="0.1" />
      <line x1="82" y1="82" x2="118" y2="82" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
      <line x1="82" y1="95" x2="110" y2="95" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
      <line x1="82" y1="108" x2="105" y2="108" stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
      {/* Checkbox empty */}
      <rect x="82" y="68" width="8" height="8" rx="2" fill="none" stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
      {/* Empty clipboard clip */}
      <path d="M85 50V46a3 3 0 013-3h4a3 3 0 013 3v4" stroke={slate} strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  );
};
