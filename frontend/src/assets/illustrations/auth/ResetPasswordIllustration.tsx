import React from 'react';
import type { IllustrationProps } from '../types';

export const ResetPasswordIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="Ilustrasi reset kata sandi - keamanan akun"
    >
      <defs>
        <linearGradient id="rpBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.15" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="rpBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <linearGradient id="rpEmerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={emerald} stopOpacity="0.3" />
          <stop offset="100%" stopColor={emerald} stopOpacity="0.1" />
        </linearGradient>
        <filter id="rpShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#rpBlue)" />

      {/* ===== SHIELD WITH LOCK ===== */}
      <g
        transform="translate(155, 50)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '6s' } : {}}
      >
        {/* Shield glow */}
        <circle cx="45" cy="55" r="70" fill="url(#rpBlue)" opacity="0.5" />
        {/* Shield shape */}
        <path
          d="M45 10L15 25v30c0 20 12 40 30 55 18-15 30-35 30-55V25L45 10z"
          fill={card}
          stroke={blue}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          filter="url(#rpShadow)"
        />
        {/* Lock inside shield */}
        <rect x="33" y="45" width="24" height="20" rx="4" fill="url(#rpBlueSolid)" opacity="0.8" />
        <path
          d="M38 45v-4a7 7 0 0114 0v4"
          stroke={card}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        {/* Keyhole */}
        <circle cx="45" cy="55" r="3" fill={card} />
        <rect x="43" y="55" width="4" height="5" rx="1" fill={card} />
        {/* Refresh arrow around shield */}
        <path
          d="M-5 30A55 55 0 0195 30"
          stroke={emerald}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
          strokeDasharray="4 3"
        />
        <polygon points="95,26 98,34 90,30" fill={emerald} opacity="0.4" />
      </g>

      {/* ===== PASSWORD FIELDS ON SCREEN ===== */}
      <g transform="translate(70, 160)" filter="url(#rpShadow)">
        {/* Card */}
        <rect x="0" y="0" width="260" height="120" rx="8" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" />
        {/* Password field dots */}
        <rect x="25" y="25" width="50" height="5" rx="2.5" fill={slate} opacity="0.15" />
        <rect x="25" y="35" width="210" height="10" rx="5" fill={blueLight} opacity="0.3" />
        <circle cx="35" cy="40" r="2" fill={slate} opacity="0.3" />
        <circle cx="43" cy="40" r="2" fill={slate} opacity="0.3" />
        <circle cx="51" cy="40" r="2" fill={slate} opacity="0.3" />
        <circle cx="59" cy="40" r="2" fill={slate} opacity="0.3" />
        {/* New password field */}
        <rect x="25" y="55" width="60" height="5" rx="2.5" fill={slate} opacity="0.15" />
        <rect x="25" y="65" width="210" height="10" rx="5" fill={blueLight} opacity="0.3" />
        <circle cx="35" cy="70" r="2" fill={slate} opacity="0.3" />
        <circle cx="43" cy="70" r="2" fill={slate} opacity="0.3" />
        <circle cx="51" cy="70" r="2" fill={slate} opacity="0.3" />
        <circle cx="59" cy="70" r="2" fill={slate} opacity="0.3" />
        {/* Submit button */}
        <rect x="25" y="88" width="120" height="12" rx="6" fill="url(#rpBlueSolid)" opacity="0.7" />
      </g>

      {/* ===== SUCCESS CHECKMARK ===== */}
      <g
        transform="translate(340, 80)"
        className={animated ? 'animate-float' : ''}
        style={animated ? { animationDuration: '5s', animationDelay: '1.5s' } : {}}
      >
        <circle cx="0" cy="0" r="20" fill="url(#rpEmerald)" />
        <circle cx="0" cy="0" r="12" fill={emerald} opacity="0.2" />
        <path d="M-5 0l3 3 7-7" stroke={emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </g>

      {/* Decorative */}
      <circle cx="60" cy="260" r="25" fill="url(#rpBlue)" />
      <circle cx="340" cy="240" r="15" fill={gold} opacity="0.2" />
      <circle cx="80" cy="40" r="3" fill={gold} opacity="0.4" />
    </svg>
  );
};

export default ResetPasswordIllustration;
