import React from 'react';
import type { IllustrationProps } from '../types';

export const LoginIllustration: React.FC<IllustrationProps> = ({
  className = '',
  variant = 'light',
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
      aria-label="Ilustrasi warga menggunakan layanan digital pemerintah"
    >
      <defs>
        <linearGradient id="loginBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="loginGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="loginBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="loginShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#loginBlue)" />

      {/* Abstract shape backdrop */}
      <circle cx="200" cy="150" r="130" fill="url(#loginBlue)" />
      <circle cx="320" cy="80" r="60" fill="url(#loginGold)" />

      {/* ===== LAPTOP / DEVICE ===== */}
      <g transform="translate(80, 140)" filter="url(#loginShadow)">
        {/* Screen frame */}
        <rect x="0" y="0" width="240" height="155" rx="8" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" />
        {/* Screen */}
        <rect x="10" y="10" width="220" height="120" rx="4" fill={bg} />
        {/* Login form UI on screen */}
        <rect x="30" y="25" width="100" height="6" rx="3" fill={slate} opacity="0.2" />
        <rect x="30" y="38" width="160" height="8" rx="4" fill={blueLight} opacity="0.5" />
        <rect x="30" y="52" width="160" height="8" rx="4" fill={blueLight} opacity="0.5" />
        {/* Button */}
        <rect x="30" y="75" width="100" height="10" rx="5" fill="url(#loginBlueSolid)" opacity="0.7" />
        {/* Shield lock icon on screen */}
        <rect x="180" y="20" width="40" height="40" rx="8" fill="url(#loginBlue)" />
        <path
          d="M195 30v4m-6 0h12a2 2 0 012 2v6a2 2 0 01-2 2h-12a2 2 0 01-2-2v-6a2 2 0 012-2zm0 0v-2a3 3 0 016 0v2"
          stroke={blue}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Laptop base */}
        <rect x="-15" y="155" width="270" height="8" rx="3" fill={slate} opacity="0.15" />
      </g>

      {/* ===== CITIZEN CHARACTER ===== */}
      <g transform="translate(45, 110)">
        {/* Body - modern professional attire */}
        <rect x="-14" y="10" width="28" height="55" rx="8" fill={blue} opacity="0.85" />
        {/* Collar */}
        <path d="M-4 20L0 28L4 20" stroke={card} strokeWidth="1.5" fill="none" />
        {/* Head */}
        <circle cx="0" cy="-8" r="18" fill={slate} />
        {/* Hair */}
        <path d="M-14 -12a14 14 0 0128-2" fill={slate} opacity="0.3" />
        {/* Face - minimal */}
        <circle cx="-5" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <circle cx="5" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <path d="M-3 -4 Q0 -1 3 -4" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Arm reaching toward laptop */}
        <path d="M14 25Q35 20 38 35" stroke={blue} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85" />
        {/* Hand */}
        <circle cx="38" cy="35" r="4" fill={slate} />
      </g>

      {/* ===== GOVERNMENT SHIELD EMBLEM ===== */}
      <g transform="translate(340, 40)">
        <circle cx="0" cy="0" r="30" fill="url(#loginGold)" />
        <circle cx="0" cy="0" r="20" fill="none" stroke={gold} strokeWidth="1.5" />
        <path
          d="M-10 -5L0 -15L10 -5L5 10L-5 10Z"
          fill={gold}
          opacity="0.7"
        />
      </g>

      {/* ===== DECORATIVE DOTS ===== */}
      <circle cx="60" cy="40" r="3" fill={gold} opacity="0.4" />
      <circle cx="160" cy="30" r="2" fill={blue} opacity="0.2" />
      <circle cx="340" cy="220" r="4" fill={gold} opacity="0.3" />
      <circle cx="50" cy="260" r="2.5" fill={blue} opacity="0.2" />
    </svg>
  );
};
