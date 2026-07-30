import React from 'react';
import type { IllustrationProps } from '../types';

export const EmailVerificationIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="Ilustrasi verifikasi email - konfirmasi akun"
    >
      <defs>
        <linearGradient id="evBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="evGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gold} stopOpacity="0.3" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="evBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="evShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#evBlue)" />

      {/* Decorative circles */}
      <circle cx="330" cy="70" r="60" fill="url(#evGold)" />
      <circle cx="50" cy="240" r="45" fill="url(#evBlue)" />

      {/* ===== GIANT ENVELOPE ===== */}
      <g
        transform="translate(85, 70)"
        filter="url(#evShadow)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '6s' } : {}}
      >
        {/* Envelope body */}
        <rect x="0" y="0" width="230" height="160" rx="12" fill={card} stroke={blue} strokeWidth="1.5" strokeOpacity="0.2" />
        {/* Envelope flap */}
        <path
          d="M0 0l115 90 115-90"
          fill={blueLight}
          stroke={blue}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          opacity="0.5"
        />
        {/* Checkmark badge */}
        <circle cx="195" cy="35" r="22" fill={emerald} />
        <path
          d="M186 35l6 6 13-13"
          stroke={card}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Sparkle */}
        <path
          d="M165 15l3-6 6-3-6-3-3-6-3 6-6 3 6 3z"
          fill={gold}
          opacity="0.6"
        />
        <path
          d="M225 70l2-4 4-2-4-2-2-4-2 4-4 2 4 2z"
          fill={gold}
          opacity="0.4"
        />
      </g>

      {/* ===== CITIZEN CHARACTER LEFT ===== */}
      <g
        transform="translate(35, 100)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '7s', animationDelay: '1s' } : {}}
      >
        {/* Body */}
        <rect x="-12" y="8" width="24" height="52" rx="8" fill={blue} opacity="0.85" />
        <path d="M-3 18L0 25L3 18" stroke={card} strokeWidth="1.5" fill="none" />
        {/* Head */}
        <circle cx="0" cy="-8" r="16" fill={slate} />
        <path d="M-12 -12a12 12 0 0124-2" fill={slate} opacity="0.3" />
        <circle cx="-4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <circle cx="4" cy="-10" r="1.5" fill={card} opacity="0.6" />
        <path d="M-2 -4Q0-1 2-4" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Arm pointing at envelope */}
        <path d="M12 22Q35 18 40 30" stroke={blue} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="40" cy="30" r="4" fill={slate} />
      </g>

      {/* ===== NOTIFICATION BELL ===== */}
      <g
        transform="translate(330, 170)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '5s', animationDelay: '2s' } : {}}
      >
        <circle cx="0" cy="0" r="22" fill={card} stroke={gold} strokeWidth="1.5" strokeOpacity="0.4" />
        <path
          d="M-4-8a6 6 0 018 0c2 3 3 6 4 8h-16c1-2 2-5 4-8z"
          fill={gold}
          opacity="0.6"
        />
        <rect x="-2" y="2" width="4" height="2" rx="1" fill={slate} opacity="0.4" />
      </g>

      {/* Decorative dots */}
      <circle cx="80" cy="38" r="2.5" fill={gold} opacity="0.4" />
      <circle cx="310" cy="260" r="3" fill={blue} opacity="0.2" />
      <circle cx="180" cy="35" r="2" fill={slate} opacity="0.2" />
    </svg>
  );
};

export default EmailVerificationIllustration;
