import React from 'react';
import type { IllustrationProps } from '../types';

export const CitizenDashboardHero: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dashboard warga - pantau laporan Anda">
      <defs>
        <linearGradient id="cdBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="cdBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="cdShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.1" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="200" rx="12" fill="url(#cdBlue)" />
      {/* Citizen character */}
      <g transform="translate(60, 55)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="-12" y="5" width="24" height="45" rx="7" fill={blue} opacity="0.85" />
        <path d="M-3 14L0 20L3 14" stroke={card} strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="-7" r="14" fill={slate} />
        <circle cx="-4" cy="-9" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-9" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -3Q0 0 2-3" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M12 18Q28 14 32 24" stroke={blue} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="32" cy="24" r="3.5" fill={slate} />
      </g>
      {/* Report cards */}
      <g transform="translate(130, 35)" filter="url(#cdShadow)">
        <rect x="0" y="0" width="230" height="60" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        <rect x="15" y="12" width="80" height="5" rx="2.5" fill={slate} opacity="0.12" />
        <rect x="15" y="22" width="140" height="4" rx="2" fill={slate} opacity="0.08" />
        <rect x="15" y="32" width="120" height="4" rx="2" fill={slate} opacity="0.08" />
        <rect x="185" y="12" width="30" height="30" rx="6" fill={blueLight} opacity="0.3" />
        <text x="200" y="32" fontSize="14" fontWeight="700" fill={blue} textAnchor="middle" fontFamily="Inter, sans-serif">5</text>
      </g>
      {/* Progress bar */}
      <g transform="translate(130, 108)" filter="url(#cdShadow)">
        <rect x="0" y="0" width="220" height="35" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        <text x="15" y="15" fontSize="9" fontWeight="600" fill={slate} opacity="0.6" fontFamily="Inter, sans-serif">Laporan Selesai</text>
        <rect x="15" y="20" width="150" height="6" rx="3" fill={slate} opacity="0.1" />
        <rect x="15" y="20" width="110" height="6" rx="3" fill="url(#cdBlueSolid)" opacity="0.7" />
        <text x="185" y="15" fontSize="11" fontWeight="700" fill={emerald} fontFamily="Inter, sans-serif">75%</text>
      </g>
      {/* Floating check */}
      <g transform="translate(370, 55)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s', animationDelay: '1s' } : {}}>
        <circle cx="0" cy="0" r="12" fill={emerald} opacity="0.15" />
        <path d="M-5 0l3 3 7-7" stroke={emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

export const OfficerDashboardHero: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dashboard petugas - tugas lapangan">
      <defs>
        <linearGradient id="odBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="odBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="odShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.1" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="200" rx="12" fill="url(#odBlue)" />
      {/* Officer character */}
      <g transform="translate(60, 45)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <path d="M-12-20a14 14 0 0124 0v3h-24z" fill={gold} opacity="0.6" />
        <circle cx="0" cy="-10" r="12" fill={slate} />
        <circle cx="-3" cy="-12" r="1.5" fill={card} opacity="0.6" />
        <circle cx="3" cy="-12" r="1.5" fill={card} opacity="0.6" />
        <rect x="-12" y="1" width="24" height="42" rx="7" fill={blue} opacity="0.85" />
        <rect x="-12" y="4" width="24" height="16" rx="4" fill={gold} opacity="0.25" />
        <line x1="-12" y1="8" x2="12" y2="8" stroke={gold} strokeWidth="1.5" opacity="0.4" />
        <path d="M12 8Q24 6 28 14" stroke={blue} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="28" cy="14" r="3.5" fill={slate} />
        <rect x="-12" y="43" width="8" height="20" rx="3" fill={slate} opacity="0.5" />
        <rect x="4" y="43" width="8" height="20" rx="3" fill={slate} opacity="0.5" />
      </g>
      {/* Task cards */}
      <g transform="translate(130, 30)" filter="url(#odShadow)">
        <rect x="0" y="0" width="140" height="50" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        <rect x="12" y="10" width="60" height="4" rx="2" fill={slate} opacity="0.12" />
        <rect x="12" y="20" width="100" height="4" rx="2" fill={slate} opacity="0.08" />
        <rect x="12" y="30" width="40" height="6" rx="3" fill={blue} opacity="0.2" />
        <text x="105" y="14" fontSize="10" fontWeight="700" fill={gold} fontFamily="Inter, sans-serif">★</text>
      </g>
      {/* Map mini */}
      <g transform="translate(285, 28)" filter="url(#odShadow)">
        <rect x="0" y="0" width="95" height="140" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        {/* Mini map */}
        <line x1="10" y1="30" x2="85" y2="30" stroke={slate} strokeWidth="0.5" opacity="0.08" />
        <line x1="10" y1="60" x2="85" y2="60" stroke={slate} strokeWidth="0.5" opacity="0.08" />
        <line x1="10" y1="90" x2="85" y2="90" stroke={slate} strokeWidth="0.5" opacity="0.08" />
        <line x1="10" y1="120" x2="85" y2="120" stroke={slate} strokeWidth="0.5" opacity="0.08" />
        <line x1="45" y1="10" x2="45" y2="130" stroke={slate} strokeWidth="0.5" opacity="0.08" />
        {/* Pin */}
        <path d="M40 55a5 5 0 00-5 5c0 3 5 8 5 8s5-5 5-8a5 5 0 00-5-5z" fill={blue} opacity="0.7" />
        <circle cx="40" cy="60" r="2" fill={card} />
        <circle cx="40" cy="60" r="1" fill={blue} />
        {/* Route */}
        <path d="M20 110l25-50 30-20" stroke={blue} strokeWidth="1" strokeDasharray="3 2" opacity="0.3" fill="none" />
      </g>
      {/* Stats row */}
      <g transform="translate(130, 90)" filter="url(#odShadow)">
        <rect x="0" y="0" width="140" height="40" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        <g transform="translate(12, 10)">
          <circle cx="0" cy="0" r="5" fill={emerald} opacity="0.3" />
          <text x="20" y="3" fontSize="11" fontWeight="700" fill={slate} fontFamily="Inter, sans-serif">{'{0}'}</text>
          <text x="30" y="3" fontSize="8" fill={slate} opacity="0.5" fontFamily="Inter, sans-serif">selesai</text>
        </g>
        <line x1="70" y1="10" x2="70" y2="30" stroke={slate} strokeWidth="0.5" opacity="0.1" />
        <g transform="translate(80, 10)">
          <circle cx="0" cy="0" r="5" fill={blue} opacity="0.3" />
          <text x="20" y="3" fontSize="11" fontWeight="700" fill={slate} fontFamily="Inter, sans-serif">{'{0}'}</text>
          <text x="30" y="3" fontSize="8" fill={slate} opacity="0.5" fontFamily="Inter, sans-serif">proses</text>
        </g>
      </g>
    </svg>
  );
};

export const AdminDashboardHero: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dashboard admin - kelola sistem">
      <defs>
        <linearGradient id="adBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="adBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="adShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.1" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="200" rx="12" fill="url(#adBlue)" />
      {/* Monitor screen */}
      <g transform="translate(50, 30)" filter="url(#adShadow)">
        <rect x="0" y="0" width="180" height="130" rx="6" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        <rect x="8" y="8" width="164" height="100" rx="3" fill={isDark ? '#0f172a' : '#f1f5f9'} />
        {/* Chart area */}
        <g transform="translate(20, 18)">
          <rect x="0" y="20" width="12" height="30" rx="2" fill={blue} opacity="0.5" />
          <rect x="18" y="10" width="12" height="40" rx="2" fill={emerald} opacity="0.5" />
          <rect x="36" y="15" width="12" height="35" rx="2" fill={gold} opacity="0.5" />
          <rect x="54" y="25" width="12" height="25" rx="2" fill={slate} opacity="0.2" />
          <rect x="72" y="8" width="12" height="42" rx="2" fill={blue} opacity="0.3" />
          <rect x="90" y="18" width="12" height="32" rx="2" fill={emerald} opacity="0.3" />
          <rect x="108" y="5" width="12" height="45" rx="2" fill={gold} opacity="0.3" />
        </g>
        {/* Monitor stand */}
        <rect x="75" y="108" width="30" height="8" rx="2" fill={slate} opacity="0.3" />
        <rect x="60" y="116" width="60" height="5" rx="2" fill={slate} opacity="0.3" />
      </g>
      {/* Admin character */}
      <g transform="translate(270, 55)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="-14" y="5" width="28" height="48" rx="7" fill={blue} opacity="0.85" />
        <path d="M-4 14L0 21L4 14" stroke={card} strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="-8" r="14" fill={slate} />
        <circle cx="-4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -4Q0-1 2-4" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Pointing at screen */}
        <path d="M14 15Q40 5 45 20" stroke={blue} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="45" cy="20" r="3.5" fill={slate} />
      </g>
      {/* Shield badge */}
      <g transform="translate(350, 40)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s', animationDelay: '1s' } : {}}>
        <path d="M0-10L-8-5v8c0 5 3 10 8 14 5-4 8-9 8-14v-8z" fill={card} stroke={blue} strokeWidth="1" opacity="0.5" />
        <circle cx="0" cy="2" r="4" fill={blue} opacity="0.4" />
      </g>
      {/* Table */}
      <g transform="translate(50, 170)">
        <rect x="0" y="0" width="300" height="4" rx="2" fill={slate} opacity="0.1" />
        <rect x="0" y="4" width="4" height="15" fill={slate} opacity="0.08" />
        <rect x="296" y="4" width="4" height="15" fill={slate} opacity="0.08" />
      </g>
    </svg>
  );
};

export const ExecutiveDashboardHero: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dashboard eksekutif - monitoring kota">
      <defs>
        <linearGradient id="edBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="edBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="edShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.1" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="200" rx="12" fill="url(#edBlue)" />
      {/* City skyline */}
      <g transform="translate(30, 80)" opacity="0.4">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <rect key={i} x={i * 25} y={-10 - Math.random() * 30} width="20" height={100 + Math.random() * 20} rx="2" fill={slate} opacity={0.15 + Math.random() * 0.15} />
        ))}
      </g>
      {/* Executive character */}
      <g transform="translate(45, 55)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="-12" y="5" width="24" height="45" rx="7" fill={blue} opacity="0.85" />
        <path d="M-4 14L0 21L4 14" stroke={card} strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="-8" r="14" fill={slate} />
        <circle cx="-4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -4Q0-1 2-4" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
      {/* Dashboard widgets */}
      <g transform="translate(130, 25)" filter="url(#edShadow)">
        <rect x="0" y="0" width="240" height="70" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        {/* Stat cards */}
        <g transform="translate(12, 12)">
          <rect x="0" y="0" width="65" height="44" rx="6" fill={blueLight} opacity="0.2" />
          <text x="20" y="18" fontSize="16" fontWeight="900" fill={blue} fontFamily="Inter, sans-serif">240</text>
          <text x="32" y="35" fontSize="7" fill={slate} opacity="0.7" fontFamily="Inter, sans-serif">Total</text>
        </g>
        <g transform="translate(85, 12)">
          <rect x="0" y="0" width="65" height="44" rx="6" fill={emerald === '#10b981' ? '#f0fdf4' : '#f0fdf4'} />
          <text x="20" y="18" fontSize="16" fontWeight="900" fill={emerald} fontFamily="Inter, sans-serif">85%</text>
          <text x="25" y="35" fontSize="7" fill={slate} opacity="0.7" fontFamily="Inter, sans-serif">Selesai</text>
        </g>
        <g transform="translate(158, 12)">
          <rect x="0" y="0" width="65" height="44" rx="6" fill={gold === '#facc15' ? '#fefce8' : '#fefce8'} />
          <text x="15" y="18" fontSize="16" fontWeight="900" fill="#d97706" fontFamily="Inter, sans-serif">48h</text>
          <text x="22" y="35" fontSize="7" fill={slate} opacity="0.7" fontFamily="Inter, sans-serif">Rata-rata</text>
        </g>
      </g>
      {/* Chart */}
      <g transform="translate(130, 108)" filter="url(#edShadow)">
        <rect x="0" y="0" width="240" height="60" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        {/* Trend chart */}
        <g transform="translate(10, 15)">
          <path d="M0 30l10-5 10-15 10 5 10-10 10 8 10-12 10 15 10-5 10 10 10-8 10 12 10-15 10 10 10-6 10 0" stroke={blue} strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M0 30l10-5 10-15 10 5 10-10 10 8 10-12 10 15 10-5 10 10" stroke="url(#edBlueSolid)" strokeWidth="2" fill="none" />
        </g>
      </g>
      {/* Trophy */}
      <g transform="translate(380, 40)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s', animationDelay: '1s' } : {}}>
        <path d="M-6-12v4a6 6 0 0012 0v-4" stroke={gold} strokeWidth="1.5" fill="none" />
        <rect x="-4" y="-12" width="8" height="14" rx="2" fill={gold} opacity="0.3" />
        <rect x="-2" y="2" width="4" height="5" rx="1" fill={slate} opacity="0.3" />
        <line x1="-6" y1="7" x2="6" y2="7" stroke={slate} strokeWidth="1.5" opacity="0.2" />
      </g>
    </svg>
  );
};
