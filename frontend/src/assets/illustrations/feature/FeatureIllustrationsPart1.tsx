import React from 'react';
import type { IllustrationProps } from '../types';

export const InteractiveMapIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Peta interaktif - pemetaan lokasi pengaduan">
      <defs>
        <linearGradient id="imBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <filter id="imShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#imBlue)" />
      {/* Map card */}
      <g transform="translate(30, 50)" filter="url(#imShadow)">
        <rect x="0" y="0" width="340" height="200" rx="10" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Map grid */}
        {[0,1,2,3,4,5].map(i => (
          <line key={`h${i}`} x1="0" y1={33 * i + 15} x2="340" y2={33 * i + 15} stroke={slate} strokeWidth="0.5" opacity="0.06" />
        ))}
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`v${i}`} x1={48 * i} y1="0" x2={48 * i} y2="200" stroke={slate} strokeWidth="0.5" opacity="0.06" />
        ))}
        {/* Roads */}
        <rect x="0" y="80" width="340" height="6" fill={slate} opacity="0.08" />
        <rect x="120" y="0" width="6" height="200" fill={slate} opacity="0.08" />
        <path d="M240 0l-30 60 30 60" stroke={slate} strokeWidth="3" opacity="0.06" fill="none" />
        {/* Pins */}
        <g className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s' } : {}} transform="translate(80, 50)">
          <path d="M0-18a12 12 0 00-12 12c0 9 12 20 12 20s12-11 12-20a12 12 0 00-12-12z" fill={blue} opacity="0.9" />
          <circle cx="0" cy="-5" r="5" fill={card} />
          <circle cx="0" cy="-5" r="2.5" fill={blue} />
        </g>
        <g transform="translate(170, 90)">
          <path d="M0-14a10 10 0 00-10 10c0 7 10 16 10 16s10-9 10-16a10 10 0 00-10-10z" fill={emerald} opacity="0.8" />
          <circle cx="0" cy="-4" r="4" fill={card} />
        </g>
        <g transform="translate(250, 60)">
          <path d="M0-12a8 8 0 00-8 8c0 6 8 13 8 13s8-7 8-13a8 8 0 00-8-8z" fill={gold} opacity="0.7" />
          <circle cx="0" cy="-3" r="3" fill={card} />
        </g>
        <g transform="translate(130, 140)">
          <path d="M0-10a7 7 0 00-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 00-7-7z" fill="#f97316" opacity="0.6" />
          <circle cx="0" cy="-3" r="2.5" fill={card} />
        </g>
        {/* Controls */}
        <rect x="290" y="15" width="35" height="60" rx="5" fill={card} stroke={slate} strokeWidth="0.8" opacity="0.4" />
        <text x="304" y="32" fontSize="12" fontWeight="700" fill={slate} opacity="0.5" fontFamily="Inter, sans-serif">+</text>
        <line x1="298" y1="40" x2="318" y2="40" stroke={slate} strokeWidth="0.5" opacity="0.3" />
        <text x="304" y="58" fontSize="12" fontWeight="700" fill={slate} opacity="0.5" fontFamily="Inter, sans-serif">−</text>
      </g>
      {/* Legend */}
      <g transform="translate(40, 260)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill={blue} opacity="0.8" />
        <text x="14" y="7" fontSize="10" fill={slate} opacity="0.6" fontFamily="Inter, sans-serif">Laporan Baru</text>
        <rect x="90" y="0" width="8" height="8" rx="2" fill={emerald} opacity="0.8" />
        <text x="104" y="7" fontSize="10" fill={slate} opacity="0.6" fontFamily="Inter, sans-serif">Selesai</text>
        <rect x="160" y="0" width="8" height="8" rx="2" fill={gold} opacity="0.8" />
        <text x="174" y="7" fontSize="10" fill={slate} opacity="0.6" fontFamily="Inter, sans-serif">Diproses</text>
      </g>
    </svg>
  );
};

export const GPSPinIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pin lokasi GPS - penandaan titik pengaduan">
      <defs>
        <linearGradient id="gpsBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="gpsBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="gpsShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.2" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#gpsBlue)" />
      {/* Giant GPS Pin */}
      <g transform="translate(200, 120)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s' } : {}}>
        {/* Glow */}
        <circle cx="0" cy="10" r="70" fill={blue} opacity="0.06" />
        <circle cx="0" cy="10" r="50" fill={blue} opacity="0.08" />
        {/* Pin shadow */}
        <ellipse cx="0" cy="65" rx="30" ry="6" fill={slate} opacity="0.1" />
        {/* Pin body */}
        <path
          d="M0-55a40 40 0 00-40 40c0 30 40 70 40 70s40-40 40-70a40 40 0 00-40-40z"
          fill="url(#gpsBlueSolid)"
          filter="url(#gpsShadow)"
        />
        {/* Pin highlight */}
        <path
          d="M0-50a35 35 0 00-35 35c0 25 35 60 35 60s35-35 35-60a35 35 0 00-35-35z"
          fill={card}
          opacity="0.1"
        />
        {/* Inner circle */}
        <circle cx="0" cy="-12" r="18" fill={card} />
        <circle cx="0" cy="-12" r="12" fill={blue} opacity="0.8" />
        {/* GPS dot */}
        <circle cx="0" cy="-12" r="4" fill={card} />
      </g>
      {/* Target crosshair */}
      <g transform="translate(300, 55)" opacity="0.4">
        <line x1="-15" y1="0" x2="15" y2="0" stroke={slate} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="-15" x2="0" y2="15" stroke={slate} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="12" fill="none" stroke={slate} strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill={slate} />
      </g>
      {/* Coordinates */}
      <g transform="translate(60, 35)" opacity="0.3">
        <rect x="0" y="0" width="80" height="28" rx="4" fill={card} stroke={slate} strokeWidth="0.8" />
        <text x="10" y="12" fontSize="8" fill={slate} fontFamily="monospace">5°27'55\"S</text>
        <text x="10" y="22" fontSize="8" fill={slate} fontFamily="monospace">122°36'25\"E</text>
      </g>
      {/* Satellite */}
      <g transform="translate(330, 230)">
        <circle cx="0" cy="0" r="15" fill={card} stroke={blue} strokeWidth="1" opacity="0.4" />
        <rect x="-3" y="-22" width="6" height="10" rx="2" fill={slate} opacity="0.3" />
        <rect x="-10" y="-5" width="20" height="4" rx="2" fill={slate} opacity="0.2" />
        {/* Signal */}
        <path d="M12-8a18 18 0 01-24-4" stroke={blue} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      </g>
    </svg>
  );
};

export const FieldOfficerIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Petugas lapangan - penanganan laporan">
      <defs>
        <linearGradient id="foBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <filter id="foShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#foBlue)" />
      {/* Ground */}
      <rect x="0" y="235" width="400" height="65" fill={card} opacity="0.5" />
      {/* Officer character */}
      <g transform="translate(120, 110)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        {/* Hard hat */}
        <path d="M-16-26a18 18 0 0132 0v4h-32z" fill={gold} opacity="0.7" />
        <rect x="-12" y="-22" width="24" height="3" rx="1.5" fill={gold} opacity="0.5" />
        {/* Head */}
        <circle cx="0" cy="-12" r="14" fill={slate} />
        <circle cx="-4" cy="-14" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-14" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -8Q0-5 2-8" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Body with vest */}
        <rect x="-14" y="2" width="28" height="52" rx="8" fill={blue} opacity="0.85" />
        {/* Safety vest */}
        <rect x="-14" y="5" width="28" height="20" rx="4" fill={gold} opacity="0.3" />
        {/* Vest stripes */}
        <line x1="-14" y1="10" x2="14" y2="10" stroke={gold} strokeWidth="1.5" opacity="0.5" />
        <line x1="-14" y1="18" x2="14" y2="18" stroke={gold} strokeWidth="1.5" opacity="0.5" />
        {/* Arms with gloves */}
        <path d="M14 12Q30 10 35 22" stroke={blue} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="35" cy="22" r="5" fill={slate} />
        <path d="M-14 12Q-30 25-38 40" stroke={blue} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="-38" cy="40" r="5" fill={slate} />
        {/* Clipboard in right hand */}
        <rect x="30" y="18" width="18" height="25" rx="3" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
        <line x1="34" y1="26" x2="44" y2="26" stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        <line x1="34" y1="32" x2="44" y2="32" stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Legs */}
        <rect x="-12" y="54" width="10" height="25" rx="4" fill={slate} opacity="0.6" />
        <rect x="2" y="54" width="10" height="25" rx="4" fill={slate} opacity="0.6" />
        {/* Boots */}
        <rect x="-14" y="74" width="14" height="8" rx="3" fill={slate} opacity="0.8" />
        <rect x="0" y="74" width="14" height="8" rx="3" fill={slate} opacity="0.8" />
      </g>
      {/* Damaged road */}
      <g transform="translate(240, 210)">
        <rect x="0" y="0" width="120" height="40" rx="6" fill={card} stroke={slate} strokeWidth="1.5" strokeOpacity="0.2" />
        {/* Road crack */}
        <path d="M30-2l8 15 4-5 10 25" stroke={slate} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        {/* Warning cone */}
        <g transform="translate(80, -20)">
          <polygon points="0,25 12,-5 24,25" fill={gold} opacity="0.6" />
          <rect x="0" y="25" width="24" height="5" rx="2" fill={gold} opacity="0.5" />
          <rect x="6" y="5" width="12" height="3" rx="1.5" fill={card} opacity="0.5" />
        </g>
      </g>
      {/* Truck */}
      <g transform="translate(300, 190)" opacity="0.4">
        <rect x="0" y="10" width="40" height="20" rx="4" fill={card} stroke={slate} strokeWidth="1" />
        <rect x="10" y="0" width="20" height="12" rx="3" fill={card} stroke={slate} strokeWidth="1" />
        <circle cx="12" cy="32" r="5" fill={slate} opacity="0.3" />
        <circle cx="30" cy="32" r="5" fill={slate} opacity="0.3" />
      </g>
    </svg>
  );
};

export const GovernmentOfficeIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kantor pemerintah - dinas terkait">
      <defs>
        <linearGradient id="goBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="goBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="goShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.15" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#goBlue)" />
      {/* Ground */}
      <rect x="-20" y="230" width="440" height="70" fill={card} opacity="0.4" />
      {/* Main government building */}
      <g transform="translate(100, 75)" filter="url(#goShadow)">
        {/* Building body */}
        <rect x="0" y="40" width="200" height="155" rx="6" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" />
        {/* Columns */}
        <rect x="20" y="50" width="12" height="120" rx="3" fill={blueLight} opacity="0.3" />
        <rect x="94" y="50" width="12" height="120" rx="3" fill={blueLight} opacity="0.3" />
        <rect x="168" y="50" width="12" height="120" rx="3" fill={blueLight} opacity="0.3" />
        {/* Entrance door */}
        <rect x="80" y="120" width="40" height="55" rx="4" fill={blue} opacity="0.15" />
        <rect x="75" y="115" width="50" height="8" rx="3" fill={blue} opacity="0.3" />
        {/* Steps */}
        <rect x="65" y="175" width="70" height="6" rx="2" fill={slate} opacity="0.1" />
        <rect x="55" y="181" width="90" height="6" rx="2" fill={slate} opacity="0.08" />
        {/* Roof */}
        <polygon points="-10,40 100,10 210,40" fill="url(#goBlueSolid)" />
        <rect x="-10" y="35" width="220" height="8" rx="3" fill={blue} opacity="0.5" />
        {/* Flag pole */}
        <line x1="160" y1="-10" x2="160" y2="40" stroke={slate} strokeWidth="2" opacity="0.5" />
        <circle cx="160" cy="-12" r="3" fill={gold} opacity="0.6" />
        {/* Flag */}
        <path d="M160-10l30 12-30 12" fill={blue} opacity="0.7" />
        {/* Windows */}
        <rect x="30" y="55" width="60" height="50" rx="3" fill={blueLight} opacity="0.15" />
        <line x1="60" y1="55" x2="60" y2="105" stroke={slate} strokeWidth="0.5" opacity="0.1" />
        <line x1="30" y1="80" x2="90" y2="80" stroke={slate} strokeWidth="0.5" opacity="0.1" />
        <rect x="110" y="55" width="60" height="50" rx="3" fill={blueLight} opacity="0.15" />
        <line x1="140" y1="55" x2="140" y2="105" stroke={slate} strokeWidth="0.5" opacity="0.1" />
        <line x1="110" y1="80" x2="170" y2="80" stroke={slate} strokeWidth="0.5" opacity="0.1" />
      </g>
      {/* Side wing */}
      <g transform="translate(40, 160)" filter="url(#goShadow)">
        <rect x="0" y="0" width="50" height="80" rx="4" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        <rect x="0" y="0" width="50" height="8" rx="2" fill={blue} opacity="0.5" />
        <rect x="10" y="15" width="30" height="20" rx="2" fill={blueLight} opacity="0.15" />
      </g>
      {/* Side wing right */}
      <g transform="translate(310, 160)" filter="url(#goShadow)">
        <rect x="0" y="0" width="50" height="80" rx="4" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        <rect x="0" y="0" width="50" height="8" rx="2" fill={blue} opacity="0.5" />
        <rect x="10" y="15" width="30" height="20" rx="2" fill={blueLight} opacity="0.15" />
      </g>
      {/* Palm tree */}
      <g transform="translate(50, 180)">
        <rect x="-3" y="-40" width="6" height="55" rx="3" fill={slate} opacity="0.3" />
        <path d="M-3-40l-20-5c-8-2-6 6 0 8l20-3z" fill={emerald} opacity="0.5" />
        <path d="M3-40l20-5c8-2 6 6 0 8l-20-3z" fill={emerald} opacity="0.5" />
        <path d="M0-42l-15-15c-6-6 2-10 8-4l7 17z" fill={emerald} opacity="0.4" />
      </g>
      {/* Car */}
      <g transform="translate(250, 245)" opacity="0.4">
        <rect x="0" y="8" width="50" height="16" rx="5" fill={card} stroke={slate} strokeWidth="1" />
        <path d="M10 8L15 0h20l5 8" fill={card} stroke={slate} strokeWidth="1" />
        <circle cx="14" cy="26" r="5" fill={slate} opacity="0.2" />
        <circle cx="36" cy="26" r="5" fill={slate} opacity="0.2" />
      </g>
    </svg>
  );
};
