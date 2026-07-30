import React from 'react';
import type { IllustrationProps } from '../types';

export const CitizenFeedbackIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Umpan balik warga - aspirasi masyarakat">
      <defs>
        <linearGradient id="cfBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="cfBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="cfShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#cfBlue)" />
      {/* Citizen character */}
      <g transform="translate(60, 100)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="-14" y="8" width="28" height="55" rx="8" fill={blue} opacity="0.85" />
        <path d="M-4 18L0 26L4 18" stroke={card} strokeWidth="1.5" fill="none" />
        <circle cx="0" cy="-10" r="18" fill={slate} />
        <path d="M-14 -14a14 14 0 0128-3" fill={slate} opacity="0.3" />
        <circle cx="-5" cy="-12" r="2" fill={card} opacity="0.6" />
        <circle cx="5" cy="-12" r="2" fill={card} opacity="0.6" />
        <path d="M-4 -3Q0 3 4-3" stroke={card} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M14 20Q35 5 40 18" stroke={blue} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="40" cy="18" r="4.5" fill={slate} />
      </g>
      {/* Feedback speech bubble */}
      <g transform="translate(130, 55)" filter="url(#cfShadow)">
        <rect x="0" y="0" width="180" height="120" rx="12" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        <path d="M50 120l-15 25 25-25" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Stars */}
        <g transform="translate(20, 20)">
          <polygon points="12,0 15,8 24,8 17,14 19,22 12,17 5,22 7,14 0,8 9,8" fill={gold} opacity="0.8" />
        </g>
        <g transform="translate(50, 15)">
          <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill={gold} opacity="0.6" />
        </g>
        <g transform="translate(75, 18)">
          <polygon points="6,0 8,4 12,4 9,7 10,12 6,9 2,12 3,7 0,4 4,4" fill={gold} opacity="0.4" />
        </g>
        {/* Thank you text placeholder */}
        <rect x="25" y="55" width="130" height="6" rx="3" fill={slate} opacity="0.15" />
        <rect x="25" y="68" width="100" height="6" rx="3" fill={slate} opacity="0.15" />
        <rect x="25" y="81" width="120" height="6" rx="3" fill={blueLight} opacity="0.3" />
      </g>
      {/* Satisfaction meter */}
      <g transform="translate(270, 160)">
        <rect x="0" y="0" width="100" height="30" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Smiley face */}
        <g transform="translate(15, 15)">
          <circle cx="0" cy="0" r="12" fill={card} stroke={slate} strokeWidth="1" opacity="0.3" />
          <circle cx="-4" cy="-3" r="1.5" fill={slate} opacity="0.4" />
          <circle cx="4" cy="-3" r="1.5" fill={slate} opacity="0.4" />
          <path d="M-4 3Q0 8 4 3" stroke={emerald} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
        {/* Ratings */}
        <text x="55" y="14" fontSize="14" fontWeight="700" fill={emerald} fontFamily="Inter, sans-serif">4.8</text>
        <text x="55" y="24" fontSize="8" fill={slate} opacity="0.5" fontFamily="Inter, sans-serif">/5.0</text>
      </g>
      {/* Decorative */}
      <circle cx="350" cy="250" r="30" fill={gold} opacity="0.08" />
      <circle cx="80" cy="40" r="3" fill={gold} opacity="0.3" />
    </svg>
  );
};

export const ComplaintTimelineIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Alur pengaduan - timeline laporan">
      <defs>
        <linearGradient id="ctBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="ctBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="ctShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#ctBlue)" />
      {/* Timeline path */}
      <g transform="translate(60, 50)">
        {/* Curved connecting path */}
        <path
          d="M40 0Q40 40 40 50v20Q40 90 80 90h220"
          stroke={blue}
          strokeWidth="2"
          fill="none"
          opacity="0.2"
          strokeDasharray="6 4"
        />
        {/* Step 1 - Report filed */}
        <g>
          <circle cx="40" cy="0" r="22" fill={blueLight} opacity="0.2" />
          <circle cx="40" cy="0" r="16" fill={bg} stroke={blue} strokeWidth="2" />
          <text x="40" y="5" fontSize="12" fontWeight="700" fill={blue} textAnchor="middle" fontFamily="Inter, sans-serif">1</text>
          <text x="75" y="-3" fontSize="11" fontWeight="600" fill={slate} fontFamily="Inter, sans-serif">Laporan Dibuat</text>
          {/* Calendar icon */}
          <rect x="75" y="5" width="55" height="18" rx="4" fill={card} stroke={slate} strokeWidth="0.8" opacity="0.3" />
          <text x="80" y="17" fontSize="7" fill={slate} opacity="0.5" fontFamily="Inter, sans-serif">12 Jan 2026</text>
        </g>
        {/* Step 2 - Verified */}
        <g transform="translate(0, 45)">
          <circle cx="40" cy="0" r="22" fill={emerald === '#10b981' ? '#f0fdf4' : isDark ? '#052e16' : '#f0fdf4'} />
          <circle cx="40" cy="0" r="16" fill={emerald} />
          <path d="M34 0l4 4 8-8" stroke={card} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="75" y="-3" fontSize="11" fontWeight="600" fill={slate} fontFamily="Inter, sans-serif">Diverifikasi</text>
        </g>
        {/* Step 3 - Processing */}
        <g transform="translate(0, 90)">
          <circle cx="40" cy="0" r="22" fill={blueLight} opacity="0.2" />
          <circle cx="40" cy="0" r="16" fill={bg} stroke={blue} strokeWidth="2" />
          <text x="40" y="5" fontSize="12" fontWeight="700" fill={blue} textAnchor="middle" fontFamily="Inter, sans-serif">3</text>
          <text x="75" y="-3" fontSize="11" fontWeight="600" fill={slate} fontFamily="Inter, sans-serif">Diproses</text>
          {/* Progress bar */}
          <rect x="75" y="6" width="80" height="8" rx="4" fill={slate} opacity="0.1" />
          <rect x="75" y="6" width="48" height="8" rx="4" fill="url(#ctBlueSolid)" opacity="0.6" />
        </g>
        {/* Step 4 - Completed */}
        <g transform="translate(190, 0)">
          <circle cx="40" cy="135" r="22" fill={emerald === '#10b981' ? '#f0fdf4' : isDark ? '#052e16' : '#f0fdf4'} />
          <circle cx="40" cy="135" r="16" fill={emerald} />
          <path d="M34 135l4 4 8-8" stroke={card} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      {/* Phone mockup */}
      <g transform="translate(280, 70)" filter="url(#ctShadow)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '7s' } : {}}>
        <rect x="0" y="0" width="50" height="85" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.3" />
        <rect x="5" y="8" width="40" height="62" rx="4" fill={bg} />
        {/* Notification */}
        <rect x="10" y="12" width="30" height="4" rx="2" fill={blue} opacity="0.3" />
        <rect x="10" y="20" width="20" height="3" rx="1.5" fill={emerald} opacity="0.4" />
        <circle cx="38" cy="14" r="3" fill="#ef4444" />
        <circle cx="25" cy="74" r="3" fill={slate} opacity="0.2" />
      </g>
    </svg>
  );
};

export const NotificationCenterIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const danger = isDark ? '#ef4444' : '#dc2626';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pusat notifikasi">
      <defs>
        <linearGradient id="ncBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <filter id="ncShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#ncBlue)" />
      {/* Giant Bell */}
      <g transform="translate(190, 100)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s' } : {}}>
        <circle cx="0" cy="0" r="60" fill={blueLight} opacity="0.15" />
        <circle cx="0" cy="5" r="45" fill={bg} stroke={slate} strokeWidth="1" strokeOpacity="0.2" />
        {/* Bell top */}
        <path d="M-22-15a24 24 0 0144 0c8 12 12 22 14 30h-72c2-8 6-18 14-30z" fill={blue} opacity="0.8" />
        {/* Bell clapper */}
        <circle cx="0" cy="25" r="8" fill={slate} opacity="0.3" />
        <rect x="-2" y="10" width="4" height="12" rx="2" fill={slate} opacity="0.3" />
        {/* Notification dots */}
        <circle cx="28" cy="-38" r="14" fill={danger} />
        <text x="28" y="-33" fontSize="11" fontWeight="900" fill={card} textAnchor="middle" fontFamily="Inter, sans-serif">3</text>
      </g>
      {/* Notification list */}
      <g transform="translate(55, 190)">
        <rect x="0" y="0" width="290" height="90" rx="8" fill={card} stroke={slate} strokeWidth="1" strokeOpacity="0.15" filter="url(#ncShadow)" />
        {/* Item 1 */}
        <g transform="translate(15, 12)">
          <circle cx="0" cy="0" r="4" fill={blue} />
          <rect x="14" y="-3" width="180" height="5" rx="2.5" fill={slate} opacity="0.12" />
          <rect x="14" y="5" width="120" height="4" rx="2" fill={slate} opacity="0.08" />
          <circle cx="252" cy="0" r="6" fill={emerald} opacity="0.2" />
        </g>
        <line x1="15" y1="28" x2="275" y2="28" stroke={slate} strokeWidth="0.5" opacity="0.1" />
        {/* Item 2 */}
        <g transform="translate(15, 38)">
          <circle cx="0" cy="0" r="4" fill={emerald} />
          <rect x="14" y="-3" width="160" height="5" rx="2.5" fill={slate} opacity="0.12" />
          <rect x="14" y="5" width="200" height="4" rx="2" fill={slate} opacity="0.08" />
        </g>
        <line x1="15" y1="25" x2="275" y2="25" stroke={slate} strokeWidth="0.5" opacity="0.1" />
        {/* Item 3 */}
        <g transform="translate(15, 63)">
          <circle cx="0" cy="0" r="4" fill={gold} />
          <rect x="14" y="-3" width="140" height="5" rx="2.5" fill={slate} opacity="0.12" />
        </g>
      </g>
    </svg>
  );
};

export const ReportsIllustration: React.FC<IllustrationProps> = ({ className = '', variant = 'light', animated = true }) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const emerald = '#10b981';
  const gold = '#facc15';
  const slate = isDark ? '#94a3b8' : '#475569';
  const card = isDark ? '#1e293b' : '#ffffff';
  const bg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Laporan dan dokumen">
      <defs>
        <linearGradient id="rpBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} stopOpacity="0.12" />
          <stop offset="100%" stopColor={blue} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="rpBlueSolid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <filter id="rpShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="12" fill="url(#rpBlue)" />
      {/* Stacked documents */}
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${55 + i * 8}, ${85 + i * 8})`} filter="url(#rpShadow)">
          <rect x="0" y="0" width="120" height="155" rx="6" fill={i === 0 ? card : `${card}99`} stroke={slate} strokeWidth="0.8" strokeOpacity="0.15" />
          {/* Content lines */}
          <rect x="15" y="20" width="90" height="5" rx="2.5" fill={slate} opacity="0.12" />
          <rect x="15" y="32" width="60" height="4" rx="2" fill={slate} opacity="0.08" />
          <rect x="15" y="44" width="90" height="4" rx="2" fill={slate} opacity="0.06" />
          <rect x="15" y="56" width="90" height="4" rx="2" fill={slate} opacity="0.06" />
          <rect x="15" y="68" width="50" height="4" rx="2" fill={slate} opacity="0.08" />
          {/* Bar chart on document */}
          <rect x="15" y="85" width="15" height="30" rx="2" fill={blue} opacity="0.3" />
          <rect x="36" y="75" width="15" height="40" rx="2" fill={emerald} opacity="0.3" />
          <rect x="57" y="80" width="15" height="35" rx="2" fill={gold} opacity="0.3" />
          <rect x="78" y="95" width="15" height="20" rx="2" fill={slate} opacity="0.15" />
        </g>
      ))}
      {/* Clipboard on top */}
      <g transform="translate(160, 65)" filter="url(#rpShadow)" className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        <rect x="0" y="0" width="160" height="180" rx="8" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.2" />
        {/* Clipboard top */}
        <rect x="65" y="-5" width="30" height="12" rx="3" fill={slate} opacity="0.2" />
        {/* Header */}
        <rect x="20" y="25" width="120" height="6" rx="3" fill={slate} opacity="0.2" />
        {/* Table header */}
        <rect x="20" y="42" width="55" height="5" rx="2.5" fill={slate} opacity="0.12" />
        <rect x="85" y="42" width="35" height="5" rx="2.5" fill={slate} opacity="0.12" />
        <rect x="128" y="42" width="15" height="5" rx="2.5" fill={slate} opacity="0.12" />
        <line x1="20" y1="53" x2="145" y2="53" stroke={slate} strokeWidth="0.5" opacity="0.1" />
        {/* Table rows */}
        {[0, 1, 2, 3, 4].map(j => (
          <g key={j} transform={`translate(20, ${62 + j * 20})`}>
            <rect x="0" y="0" width="50" height="4" rx="2" fill={slate} opacity="0.08" />
            <rect x="60" y="0" width="40" height="4" rx="2" fill={slate} opacity="0.06" />
            <rect x="108" y="0" width="35" height="4" rx="2" fill={slate} opacity="0.06" />
            {j < 4 && <line x1="0" y1="10" x2="125" y2="10" stroke={slate} strokeWidth="0.5" opacity="0.06" />}
          </g>
        ))}
        {/* Checkmark stamp */}
        <g transform="translate(110, 148)">
          <rect x="0" y="0" width="35" height="20" rx="4" fill={emerald} opacity="0.15" />
          <text x="17" y="14" fontSize="9" fontWeight="700" fill={emerald} textAnchor="middle" fontFamily="Inter, sans-serif">✓</text>
        </g>
      </g>
    </svg>
  );
};
