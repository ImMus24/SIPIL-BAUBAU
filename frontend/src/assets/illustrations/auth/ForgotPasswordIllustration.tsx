import React from 'react';
import type { IllustrationProps } from '../types';

export const ForgotPasswordIllustration: React.FC<IllustrationProps> = ({
  className = '',
  variant = 'light',
  animated = true,
}) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
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
      aria-label="Ilustrasi lupa kata sandi - pemulihan akun"
    >
      <defs>
        <linearGradient id="fpBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="fpGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="fpBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="fpShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#fpBlue)" />

      {/* Decorative shapes */}
      <circle cx="340" cy="60" r="50" fill="url(#fpGold)" />
      <circle cx="50" cy="250" r="40" fill="url(#fpBlue)" />

      {/* ===== KEY / SECURITY TOKEN ===== */}
      <g
        transform="translate(130, 60)"
        filter="url(#fpShadow)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '6s' } : {}}
      >
        {/* Key bow (top circle) */}
        <circle cx="40" cy="30" r="28" fill={card} stroke={blue} strokeWidth="1.5" strokeOpacity="0.3" />
        <circle cx="40" cy="30" r="18" fill="none" stroke={blue} strokeWidth="1.5" strokeOpacity="0.2" />
        {/* Key hole */}
        <circle cx="40" cy="30" r="5" fill={blue} opacity="0.4" />
        {/* Key shaft */}
        <rect x="68" y="27" width="60" height="6" rx="3" fill={blue} opacity="0.6" />
        {/* Key teeth */}
        <rect x="110" y="33" width="4" height="10" rx="1" fill={blue} opacity="0.6" />
        <rect x="118" y="33" width="4" height="7" rx="1" fill={blue} opacity="0.6" />
        <rect x="126" y="33" width="4" height="12" rx="1" fill={blue} opacity="0.6" />
      </g>

      {/* ===== LAPTOP WITH PASSWORD RESET FORM ===== */}
      <g transform="translate(60, 140)" filter="url(#fpShadow)">
        {/* Screen frame */}
        <rect x="0" y="0" width="280" height="140" rx="8" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" />
        {/* Screen */}
        <rect x="12" y="12" width="256" height="100" rx="4" fill={bg} />
        {/* Email field */}
        <rect x="30" y="30" width="60" height="5" rx="2.5" fill={slate} opacity="0.15" />
        <rect x="30" y="40" width="200" height="10" rx="5" fill={blueLight} opacity="0.4" />
        {/* Reset button */}
        <rect x="30" y="65" width="120" height="12" rx="6" fill="url(#fpBlueSolid)" opacity="0.7" />
        {/* Checkmark on screen */}
        <g transform="translate(220, 55)" opacity="0.5">
          <circle cx="12" cy="12" r="12" fill={isDark ? '#052e16' : '#f0fdf4'} />
          <path d="M7 12l3 3 7-7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Laptop base */}
        <rect x="-15" y="140" width="310" height="8" rx="3" fill={slate} opacity="0.15" />
      </g>

      {/* ===== CITIZEN CHARACTER ===== */}
      <g
        transform="translate(40, 100)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '7s', animationDelay: '1s' } : {}}
      >
        {/* Body */}
        <rect x="-12" y="10" width="24" height="50" rx="8" fill={blue} opacity="0.85" />
        {/* Collar */}
        <path d="M-3 18L0 25L3 18" stroke={card} strokeWidth="1.5" fill="none" />
        {/* Head */}
        <circle cx="0" cy="-6" r="16" fill={slate} />
        {/* Hair */}
        <path d="M-12 -10a12 12 0 0124-2" fill={slate} opacity="0.3" />
        {/* Face */}
        <circle cx="-4" cy="-8" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-8" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -2Q0 1 2-2" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Arm */}
        <path d="M12 20Q30 15 35 25" stroke={blue} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="35" cy="25" r="4" fill={slate} />
      </g>

      {/* ===== FLOATING ENVELOPE ===== */}
      <g
        transform="translate(320, 160)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '5s', animationDelay: '2s' } : {}}
      >
        <rect x="0" y="0" width="36" height="26" rx="4" fill={card} stroke={blue} strokeWidth="1" strokeOpacity="0.3" />
        <path d="M0 0l18 14 18-14" stroke={blue} strokeWidth="1" strokeOpacity="0.4" fill="none" />
      </g>

      {/* Decorative dots */}
      <circle cx="80" cy="45" r="3" fill={gold} opacity="0.4" />
      <circle cx="310" cy="260" r="2.5" fill={blue} opacity="0.2" />
      <circle cx="160" cy="30" r="2" fill={slate} opacity="0.2" />
    </svg>
  );
};

export default ForgotPasswordIllustration;
