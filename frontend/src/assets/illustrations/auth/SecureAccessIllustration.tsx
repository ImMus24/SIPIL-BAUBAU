import React from 'react';
import type { IllustrationProps } from '../types';

export const SecureAccessIllustration: React.FC<IllustrationProps> = ({
  className = '',
  variant = 'light',
  animated = true,
}) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustrasi akses aman - keamanan pemerintah digital"
    >
      <defs>
        <linearGradient id="saBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="saBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <linearGradient id="saGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.1" />
        </linearGradient>
        <filter id="saShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#saBlue)" />

      {/* Decorative */}
      <circle cx="340" cy="60" r="55" fill="url(#saGold)" />
      <circle cx="50" cy="250" r="40" fill="url(#saBlue)" />

      {/* ===== CENTRAL SHIELD WITH PADLOCK ===== */}
      <g
        transform="translate(130, 55)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '6s' } : {}}
      >
        {/* Outer glow */}
        <circle cx="70" cy="75" r="85" fill="url(#saBlue)" opacity="0.4" />
        {/* Large shield */}
        <path
          d="M70 15L25 40v40c0 25 18 50 45 65 27-15 45-40 45-65V40L70 15z"
          fill="url(#saBlueSolid)"
          filter="url(#saShadow)"
        />
        {/* Shield inner border */}
        <path
          d="M70 25L35 45v32c0 20 14 42 35 55 21-13 35-35 35-55V45L70 25z"
          fill={card}
          opacity="0.15"
        />
        {/* Padlock */}
        <rect x="54" y="58" width="32" height="26" rx="5" fill={card} />
        <path
          d="M62 58v-6a8 8 0 0116 0v6"
          stroke={card}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Keyhole */}
        <circle cx="70" cy="70" r="4" fill="url(#saBlueSolid)" />
        <rect x="68" y="70" width="4" height="7" rx="1" fill="url(#saBlueSolid)" />
        {/* Checkmark */}
        <path
          d="M55 120l10 10 20-20"
          stroke={emerald}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </g>

      {/* ===== GOVERNMENT OFFICE BUILDING ===== */}
      <g transform="translate(20, 170)" filter="url(#saShadow)">
        {/* Building base */}
        <rect x="0" y="0" width="100" height="100" rx="4" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Columns */}
        <rect x="8" y="15" width="10" height="72" rx="2" fill={blueLight} opacity="0.4" />
        <rect x="45" y="15" width="10" height="72" rx="2" fill={blueLight} opacity="0.4" />
        <rect x="82" y="15" width="10" height="72" rx="2" fill={blueLight} opacity="0.4" />
        {/* Roof */}
        <rect x="0" y="0" width="100" height="10" rx="3" fill={blue} opacity="0.6" />
        {/* Flag */}
        <line x1="50" y1="0" x2="50" y2="-25" stroke={slate} strokeWidth="1.5" opacity="0.4" />
        <rect x="50" y="-25" width="25" height="15" rx="2" fill={blue} opacity="0.7" />
        {/* Star on flag */}
        <polygon points="62,-22 64,-17 69,-17 65,-14 67,-9 62,-12 57,-9 59,-14 55,-17 60,-17" fill={card} />
      </g>

      {/* ===== FINGERPRINT ICON ===== */}
      <g
        transform="translate(320, 150)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '7s', animationDelay: '1.5s' } : {}}
      >
        <circle cx="0" cy="0" r="24" fill={card} stroke={blue} strokeWidth="1" strokeOpacity="0.3" />
        <path
          d="M-6-12a8 8 0 0112 0M-8-8a12 12 0 0116 0M-10-4a16 16 0 0120 0M-12 0a20 20 0 0124 0M-6 4a12 12 0 0112 0M-3 8a6 6 0 016 0"
          stroke={blue}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      {/* Decorative dots */}
      <circle cx="80" cy="40" r="3" fill={gold} opacity="0.4" />
      <circle cx="180" cy="50" r="2" fill={slate} opacity="0.2" />
      <circle cx="340" cy="260" r="4" fill={gold} opacity="0.3" />
    </svg>
  );
};

export default SecureAccessIllustration;
