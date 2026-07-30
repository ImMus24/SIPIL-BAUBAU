import React from 'react';
import type { IllustrationProps } from '../types';

export const RegisterIllustration: React.FC<IllustrationProps> = ({
  className = '',
  variant = 'light',
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
      aria-label="Ilustrasi pendaftaran identitas digital untuk layanan pemerintah"
    >
      <defs>
        <linearGradient id="regBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="regGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gold} stopOpacity="0.25" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="regEmerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={emerald} />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="regBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="regShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#regBlue)" />

      {/* Decorative circles */}
      <circle cx="80" cy="60" r="50" fill="url(#regGold)" />
      <circle cx="350" cy="250" r="70" fill="url(#regBlue)" />

      {/* ===== DIGITAL ID CARD ===== */}
      <g transform="translate(170, 85)" filter="url(#regShadow)">
        {/* Card body */}
        <rect x="0" y="0" width="200" height="130" rx="10" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" />
        {/* Card header stripe */}
        <rect x="0" y="0" width="200" height="35" rx="10" fill="url(#regBlueSolid)" opacity="0.9" />
        <rect x="0" y="20" width="200" height="15" fill="url(#regBlueSolid)" opacity="0.9" />
        {/* Shield icon on card */}
        <circle cx="24" cy="17" r="10" fill={card} opacity="0.3" />
        <path d="M20 14v2M17 15h6a1 1 0 011 1v3a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3a1 1 0 011-1zm0 0v-1a1.5 1.5 0 013 0v1" stroke={card} strokeWidth="1.2" strokeLinecap="round" />
        {/* Card text lines */}
        <rect x="20" y="50" width="90" height="4" rx="2" fill={slate} opacity="0.2" />
        <rect x="20" y="60" width="120" height="4" rx="2" fill={slate} opacity="0.15" />
        <rect x="20" y="72" width="100" height="4" rx="2" fill={slate} opacity="0.2" />
        <rect x="20" y="82" width="130" height="4" rx="2" fill={slate} opacity="0.15" />
        <rect x="20" y="94" width="60" height="4" rx="2" fill={slate} opacity="0.2" />
        {/* Avatar placeholder */}
        <circle cx="170" cy="75" r="22" fill={blueLight} opacity="0.6" />
        <circle cx="170" cy="65" r="7" fill={slate} opacity="0.25" />
        <ellipse cx="170" cy="86" rx="12" ry="7" fill={slate} opacity="0.15" />
        {/* Gold verification badge */}
        <circle cx="170" cy="105" r="8" fill={gold} opacity="0.3" />
        <path d="M167 105l2 2 4-4" stroke={gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ===== CHECKLIST / VERIFICATION (right side) ===== */}
      <g transform="translate(390, 130)">
        <circle cx="0" cy="0" r="16" fill="url(#regEmerald)" opacity="0.15" />
        <circle cx="0" cy="0" r="10" fill={emerald} opacity="0.3" />
        <path d="M-5 0l3 3 7-7" stroke={card} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* ===== DECORATIVE DOCUMENTS ===== */}
      <g transform="translate(30, 140)" opacity="0.7">
        <rect x="0" y="0" width="45" height="55" rx="4" fill={card} stroke={slate} strokeWidth="0.8" strokeOpacity="0.2" transform="rotate(-8)" filter="url(#regShadow)" />
        <line x1="8" y1="15" x2="37" y2="15" stroke={slate} strokeWidth="1" strokeOpacity="0.15" transform="rotate(-8)" />
        <line x1="8" y1="24" x2="35" y2="24" stroke={slate} strokeWidth="1" strokeOpacity="0.15" transform="rotate(-8)" />
        <line x1="8" y1="33" x2="30" y2="33" stroke={slate} strokeWidth="1" strokeOpacity="0.15" transform="rotate(-8)" />
      </g>

      {/* ===== CHECKLIST ITEMS ===== */}
      <g transform="translate(25, 215)">
        <rect x="0" y="0" width="140" height="28" rx="14" fill={card} stroke={emerald} strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="18" cy="14" r="6" fill={emerald} opacity="0.8" />
        <path d="M15 14l2 2 4-4" stroke={card} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="32" y="18" fontSize="9" fill={slate} fontFamily="Inter, sans-serif" opacity="0.7">Data Terverifikasi</text>
      </g>

      {/* ===== DECORATIVE DOTS ===== */}
      <circle cx="350" cy="50" r="3" fill={gold} opacity="0.35" />
      <circle cx="310" cy="40" r="2" fill={blue} opacity="0.15" />
      <circle cx="60" cy="270" r="3" fill={emerald} opacity="0.25" />
      <circle cx="370" cy="200" r="2.5" fill={gold} opacity="0.2" />
    </svg>
  );
};
