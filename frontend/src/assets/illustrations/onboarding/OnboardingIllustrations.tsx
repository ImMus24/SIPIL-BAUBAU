import React from 'react';
import type { IllustrationProps } from '../types';

export const OnboardingComplaint: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Langkah 1: Buat laporan pengaduan">
      <defs>
        <linearGradient id="o1Blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="o1BlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="o1Shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#o1Blue)" />
      {/* Step number */}
      <circle cx="50" cy="40" r="20" fill={blue} opacity="0.15" />
      <text x="43" y="47" fontSize="16" fontWeight="900" fill={blue} fontFamily="Poppins, sans-serif">1</text>
      {/* Report form UI */}
      <g transform="translate(80, 80)" filter="url(#o1Shadow)">
        <rect x="0" y="0" width="240" height="165" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        <rect x="20" y="20" width="100" height="5" rx="2.5" fill={slate} opacity="0.15" />
        <rect x="20" y="30" width="200" height="10" rx="5" fill={blueLight} opacity="0.3" />
        <rect x="20" y="50" width="80" height="5" rx="2.5" fill={slate} opacity="0.15" />
        <rect x="20" y="60" width="200" height="30" rx="5" fill={blueLight} opacity="0.2" />
        <rect x="20" y="100" width="60" height="5" rx="2.5" fill={slate} opacity="0.15" />
        <rect x="20" y="110" width="100" height="10" rx="5" fill={blueLight} opacity="0.3" />
        <rect x="20" y="135" width="140" height="12" rx="6" fill="url(#o1BlueSolid)" opacity="0.7" />
      </g>
      {/* Citizen character */}
      <g transform="translate(40, 115)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="-12" y="8" width="24" height="50" rx="8" fill={blue} opacity="0.85" />
        <path d="M-3 18L0 25L3 18" stroke={card} strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="-8" r="16" fill={slate} />
        <path d="M-12 -12a12 12 0 0124-2" fill={slate} opacity="0.3" />
        <circle cx="-4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -4Q0-1 2-4" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M12 22Q30 18 35 30" stroke={blue} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="35" cy="30" r="4" fill={slate} />
        {/* Plus icon */}
        <circle cx="45" cy="25" r="8" fill={gold} opacity="0.5" />
        <line x1="45" y1="21" x2="45" y2="29" stroke={card} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="41" y1="25" x2="49" y2="25" stroke={card} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* Decorative */}
      <circle cx="340" cy="250" r="30" fill={gold} opacity="0.1" />
      <circle cx="320" cy="60" r="4" fill={gold} opacity="0.3" />
    </svg>
  );
};

export const OnboardingLocation: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Langkah 2: Pilih lokasi">
      <defs>
        <linearGradient id="o2Blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="o2BlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="o2Shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#o2Blue)" />
      <circle cx="50" cy="40" r="20" fill={blue} opacity="0.15" />
      <text x="43" y="47" fontSize="16" fontWeight="900" fill={blue} fontFamily="Poppins, sans-serif">2</text>
      {/* Map area */}
      <g transform="translate(80, 70)" filter="url(#o2Shadow)">
        <rect x="0" y="0" width="240" height="190" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Map grid */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={`h${i}`} x1="0" y1={38 * i + 20} x2="240" y2={38 * i + 20} stroke={slate} strokeWidth="0.5" opacity="0.08" />
        ))}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line key={`v${i}`} x1={48 * i} y1="0" x2={48 * i} y2="190" stroke={slate} strokeWidth="0.5" opacity="0.08" />
        ))}
        {/* Road */}
        <rect x="0" y="75" width="240" height="8" fill={slate} opacity="0.08" />
        <rect x="110" y="0" width="8" height="190" fill={slate} opacity="0.08" />
        {/* Map pin */}
        <g transform="translate(120, 70)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s' } : {}}>
          <path d="M0-20a15 15 0 00-15 15c0 11 15 25 15 25s15-14 15-25a15 15 0 00-15-15z" fill={blue} opacity="0.9" />
          <circle cx="0" cy="-5" r="6" fill={card} />
          <circle cx="0" cy="-5" r="3" fill={blue} />
        </g>
        {/* Secondary pin */}
        <path d="M50 110a6 6 0 00-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 00-6-6z" fill={emerald} opacity="0.6" />
        <circle cx="50" cy="116" r="2.5" fill={card} />
        {/* Pin 3 */}
        <path d="M190 130a5 5 0 00-5 5c0 3 5 8 5 8s5-5 5-8a5 5 0 00-5-5z" fill={gold} opacity="0.5" />
        <circle cx="190" cy="135" r="2" fill={card} />
      </g>
      {/* Character choosing location */}
      <g transform="translate(35, 120)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '7s', animationDelay: '1s' } : {}}>
        <rect x="-12" y="8" width="24" height="50" rx="8" fill={blue} opacity="0.85" />
        <path d="M-3 18L0 25L3 18" stroke={card} strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="-8" r="16" fill={slate} />
        <path d="M-12 -12a12 12 0 0124-2" fill={slate} opacity="0.3" />
        <circle cx="-4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -4Q0-1 2-4" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M12 22Q35 15 40 28" stroke={blue} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="40" cy="28" r="4" fill={slate} />
      </g>
      {/* GPS icon */}
      <g transform="translate(340, 80)">
        <circle cx="0" cy="0" r="16" fill={card} stroke={blue} strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="0" cy="0" r="6" fill={blue} opacity="0.6" />
        <rect x="-1" y="-22" width="2" height="8" rx="1" fill={slate} opacity="0.3" />
        <rect x="-1" y="14" width="2" height="8" rx="1" fill={slate} opacity="0.3" />
        <rect x="-22" y="-1" width="8" height="2" rx="1" fill={slate} opacity="0.3" />
        <rect x="14" y="-1" width="8" height="2" rx="1" fill={slate} opacity="0.3" />
      </g>
    </svg>
  );
};

export const OnboardingTrack: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Langkah 3: Lacak perkembangan">
      <defs>
        <linearGradient id="o3Blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="o3BlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="o3Shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#o3Blue)" />
      <circle cx="50" cy="40" r="20" fill={blue} opacity="0.15" />
      <text x="43" y="47" fontSize="16" fontWeight="900" fill={blue} fontFamily="Poppins, sans-serif">3</text>
      {/* Timeline card */}
      <g transform="translate(30, 70)" filter="url(#o3Shadow)">
        <rect x="0" y="0" width="340" height="190" rx="10" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Timeline vertical line */}
        <line x1="60" y1="20" x2="60" y2="170" stroke={blue} strokeWidth="2" opacity="0.2" />
        {/* Step 1 - submitted */}
        <g transform="translate(0, 15)">
          <circle cx="60" cy="12" r="8" fill={emerald} />
          <path d="M56 12l3 2 5-5" stroke={card} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="85" y="16" fontSize="13" fontWeight="600" fill={slate} fontFamily="Inter, sans-serif">Laporan terkirim</text>
        </g>
        {/* Step 2 - verified */}
        <g transform="translate(0, 55)">
          <circle cx="60" cy="12" r="8" fill={emerald} />
          <path d="M56 12l3 2 5-5" stroke={card} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="85" y="16" fontSize="13" fontWeight="600" fill={slate} fontFamily="Inter, sans-serif">Diverifikasi Admin</text>
        </g>
        {/* Step 3 - processing */}
        <g transform="translate(0, 95)">
          <circle cx="60" cy="12" r="8" fill={blue} />
          <text x="85" y="16" fontSize="13" fontWeight="600" fill={blue} fontFamily="Inter, sans-serif">Sedang diproses</text>
          {/* Animated spinner */}
          <circle cx="60" cy="12" r="11" fill="none" stroke={blue} strokeWidth="2" opacity="0.3" />
        </g>
        {/* Step 4 - pending */}
        <g transform="translate(0, 135)">
          <circle cx="60" cy="12" r="8" fill="none" stroke={slate} strokeWidth="2" strokeDasharray="3 2" opacity="0.3" />
          <text x="85" y="16" fontSize="13" fontWeight="600" fill={slate} opacity="0.3" fontFamily="Inter, sans-serif">Selesai</text>
        </g>
      </g>
      {/* Phone in hand */}
      <g transform="translate(240, 85)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="0" y="0" width="40" height="65" rx="6" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
        <rect x="5" y="5" width="30" height="48" rx="3" fill={bg} />
        <circle cx="20" cy="58" r="3" fill="none" stroke={slate} strokeWidth="0.8" opacity="0.3" />
        {/* Screen content */}
        <rect x="10" y="12" width="20" height="2" rx="1" fill={blue} opacity="0.3" />
        <rect x="10" y="18" width="15" height="2" rx="1" fill={emerald} opacity="0.4" />
        <rect x="10" y="24" width="20" height="2" rx="1" fill={gold} opacity="0.3" />
      </g>
      <circle cx="340" cy="250" r="30" fill={gold} opacity="0.1" />
    </svg>
  );
};

export const OnboardingComplete: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Langkah 4: Terima notifikasi penyelesaian">
      <defs>
        <linearGradient id="o4Blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="o4Emerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={emerald} stopOpacity="0.3" />
          <stop offset="100%" stopColor={emerald} stopOpacity="0.1" />
        </linearGradient>
        <filter id="o4Shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#o4Blue)" />
      <circle cx="50" cy="40" r="20" fill={blue} opacity="0.15" />
      <text x="43" y="47" fontSize="16" fontWeight="900" fill={blue} fontFamily="Poppins, sans-serif">4</text>
      {/* Big success check */}
      <g transform="translate(125, 60)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <circle cx="0" cy="0" r="60" fill="url(#o4Emerald)" filter="url(#o4Shadow)" />
        <circle cx="0" cy="0" r="45" fill={emerald} opacity="0.1" />
        <circle cx="0" cy="0" r="30" fill={emerald} />
        <path d="M-15 0l10 10 20-20" stroke={card} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Notification bell receiving signal */}
      <g transform="translate(300, 80)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s', animationDelay: '1s' } : {}}>
        <circle cx="0" cy="0" r="22" fill={card} stroke={blue} strokeWidth="1" strokeOpacity="0.3" />
        <path d="M-6-8a8 8 0 0112 0c3 4 4 7 5 10h-22c1-3 2-6 5-10z" fill={blue} opacity="0.7" />
        <rect x="-3" y="3" width="6" height="3" rx="1.5" fill={slate} opacity="0.4" />
        {/* Signal waves */}
        <path d="M-18-2a16 16 0 0136 0" stroke={emerald} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M-14-6a12 12 0 0128 0" stroke={emerald} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </g>
      {/* Citizen satisfied */}
      <g transform="translate(65, 140)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '7s', animationDelay: '0.5s' } : {}}>
        <rect x="-14" y="8" width="28" height="55" rx="8" fill={blue} opacity="0.85" />
        <path d="M-4 18L0 26L4 18" stroke={card} strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="-10" r="18" fill={slate} />
        <path d="M-14 -14a14 14 0 0128-3" fill={slate} opacity="0.3" />
        <circle cx="-5" cy="-12" r="1.5" fill={card} opacity="0.6" />
        <circle cx="5" cy="-12" r="1.5" fill={card} opacity="0.6" />
        {/* Smile */}
        <path d="M-4 -3Q0 3 4-3" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Thumbs up */}
        <g transform="translate(18, 10)">
          <path d="M0 8v-6a2 2 0 012-2l4 2v8" fill={gold} opacity="0.6" />
          <rect x="0" y="8" width="6" height="10" rx="1.5" fill={gold} opacity="0.6" />
        </g>
      </g>
      {/* Paper plane */}
      <g transform="translate(350, 230)" opacity="0.3">
        <path d="M0 0l-12 6 4-4" fill={blue} />
        <path d="M-8 2l-4 8 4-4" fill={blue} />
      </g>
      <circle cx="340" cy="40" r="3" fill={gold} opacity="0.4" />
      <circle cx="80" cy="260" r="25" fill={gold} opacity="0.08" />
    </svg>
  );
};
