import React from 'react';
import type { IllustrationProps } from '../types';

export const HeroIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 'lg',
  variant = 'light',
  animated = true,
}) => {
  const isDark = variant === 'dark';
  const blue = isDark ? '#3b82f6' : '#004ac6';
  const blueLight = isDark ? '#1e3a5f' : '#dbeafe';
  const gold = '#facc15';
  const emerald = '#10b981';
  const slate = isDark ? '#94a3b8' : '#475569';
  const bg = isDark ? '#1e293b' : '#f8fafc';
  const card = isDark ? '#0f172a' : '#ffffff';
  const accentLight = isDark ? '#422006' : '#fefce8';

  const sizes: Record<string, { w: number; h: number }> = {
    sm: { w: 280, h: 210 },
    md: { w: 400, h: 300 },
    lg: { w: 520, h: 390 },
    xl: { w: 640, h: 480 },
    full: { w: 720, h: 540 },
  };
  const { w, h } = sizes[size] || sizes.lg;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hero ilustrasi Kota Baubau - Sistem Pengaduan Infrastruktur"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blueLight} stopOpacity="0.5" />
          <stop offset="100%" stopColor={bg} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={blue} />
          <stop offset="100%" stopColor={isDark ? '#2563eb' : '#003896'} />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gold} />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={emerald} />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="heroShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
        </filter>
        <filter id="heroGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={blue} floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Background sky */}
      <rect x="0" y="0" width={w} height={h} rx="12" fill="url(#skyGrad)" />

      {/* Grid pattern background */}
      <g opacity="0.06">
        {Array.from({ length: Math.floor(w / 40) }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={h} stroke={slate} strokeWidth="1" />
        ))}
        {Array.from({ length: Math.floor(h / 40) }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2={w} y2={i * 40} stroke={slate} strokeWidth="1" />
        ))}
      </g>

      {/* ===== GROUND PLANE ===== */}
      <g transform={`translate(${w * 0.05}, ${h * 0.55})`}>
        {/* Base platform */}
        <path
          d={`M0 ${h * 0.3} L${w * 0.45} ${h * 0.15} L${w * 0.9} ${h * 0.3} L${w * 0.45} ${h * 0.45}Z`}
          fill={card}
          stroke={slate}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          filter="url(#heroShadow)"
        />
        {/* Platform top surface */}
        <path
          d={`M0 ${h * 0.3} L${w * 0.45} ${h * 0.15} L${w * 0.9} ${h * 0.3}`}
          fill="none"
          stroke={slate}
          strokeWidth="1"
          strokeOpacity="0.2"
        />
      </g>

      {/* ===== BUILDINGS (Isometric) ===== */}
      <g transform={`translate(${w * 0.08}, ${h * 0.35})`}>
        {/* Building 1 */}
        <rect x="0" y={h * -0.15} width={w * 0.08} height={h * 0.3} rx="3" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" filter="url(#heroShadow)" />
        <rect x={w * 0.01} y={h * -0.1} width={w * 0.025} height={h * 0.03} rx="1" fill={blue} opacity="0.6" />
        <rect x={w * 0.045} y={h * -0.1} width={w * 0.025} height={h * 0.03} rx="1" fill={blue} opacity="0.6" />
        <rect x={w * 0.01} y={h * -0.05} width={w * 0.025} height={h * 0.03} rx="1" fill={blue} opacity="0.6" />
        <rect x={w * 0.045} y={h * -0.05} width={w * 0.025} height={h * 0.03} rx="1" fill={blue} opacity="0.6" />

        {/* Building 2 */}
        <rect x={w * 0.1} y={h * -0.2} width={w * 0.1} height={h * 0.35} rx="3" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" filter="url(#heroShadow)" />
        <rect x={w * 0.12} y={h * -0.15} width={w * 0.03} height={h * 0.04} rx="1" fill={emerald} opacity="0.5" />
        <rect x={w * 0.16} y={h * -0.15} width={w * 0.03} height={h * 0.04} rx="1" fill={emerald} opacity="0.5" />
        <rect x={w * 0.12} y={h * -0.08} width={w * 0.03} height={h * 0.04} rx="1" fill={emerald} opacity="0.5" />
        <rect x={w * 0.16} y={h * -0.08} width={w * 0.03} height={h * 0.04} rx="1" fill={emerald} opacity="0.5" />

        {/* Building 3 - taller */}
        <rect x={w * 0.23} y={h * -0.25} width={w * 0.07} height={h * 0.4} rx="3" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" filter="url(#heroShadow)" />
        <rect x={w * 0.25} y={h * -0.2} width={w * 0.03} height={h * 0.03} rx="1" fill={gold} opacity="0.7" />
        <rect x={w * 0.25} y={h * -0.14} width={w * 0.03} height={h * 0.03} rx="1" fill={gold} opacity="0.7" />
        <rect x={w * 0.25} y={h * -0.08} width={w * 0.03} height={h * 0.03} rx="1" fill={gold} opacity="0.7" />
      </g>

      {/* ===== MAP PIN (large central visual) ===== */}
      <g transform={`translate(${w * 0.38}, ${h * 0.38})`} filter="url(#heroGlow)">
        <circle cx="0" cy="0" r={w * 0.06} fill="url(#blueGrad)" opacity="0.15" />
        <circle cx="0" cy="0" r={w * 0.04} fill="url(#blueGrad)" opacity="0.25" />
        <path
          d={`M0 ${h * -0.04}
              C${w * 0.025} ${h * -0.04} ${w * 0.04} ${h * -0.015} ${w * 0.04} 0
              C${w * 0.04} ${h * 0.015} ${w * 0.025} ${h * 0.03} 0 ${h * 0.04}
              C${w * -0.025} ${h * 0.03} ${w * -0.04} ${h * 0.015} ${w * -0.04} 0
              C${w * -0.04} ${h * -0.015} ${w * -0.025} ${h * -0.04} 0 ${h * -0.04}Z`}
          fill="url(#blueGrad)"
        />
        <circle cx="0" cy="0" r={w * 0.015} fill={card} />
      </g>

      {/* ===== CITIZEN CHARACTER (left) ===== */}
      <g transform={`translate(${w * 0.2}, ${h * 0.42})`} className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6s' } : {}}>
        {/* Body */}
        <rect x={w * -0.025} y={h * -0.02} width={w * 0.05} height={h * 0.08} rx={w * 0.01} fill={blue} opacity="0.8" />
        {/* Head */}
        <circle cx="0" cy={h * -0.045} r={w * 0.015} fill={slate} />
        {/* Phone */}
        <rect x={w * 0.015} y={h * -0.015} width={w * 0.015} height={h * 0.025} rx="2" fill={card} stroke={blue} strokeWidth="1" />
      </g>

      {/* ===== OFFICER CHARACTER (right) ===== */}
      <g transform={`translate(${w * 0.65}, ${h * 0.42})`} className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '7s', animationDelay: '1s' } : {}}>
        {/* Body */}
        <rect x={w * -0.025} y={h * -0.02} width={w * 0.05} height={h * 0.08} rx={w * 0.01} fill={emerald} opacity="0.8" />
        {/* Head */}
        <circle cx="0" cy={h * -0.045} r={w * 0.015} fill={slate} />
        {/* Clipboard */}
        <rect x={w * -0.035} y={h * -0.01} width={w * 0.02} height={h * 0.025} rx="1.5" fill={card} stroke={emerald} strokeWidth="1" />
      </g>

      {/* ===== SMART DASHBOARD / SCREEN ===== */}
      <g transform={`translate(${w * 0.55}, ${h * 0.28})`} filter="url(#heroShadow)">
        {/* Monitor frame */}
        <rect x="0" y="0" width={w * 0.18} height={h * 0.12} rx="6" fill={card} stroke={slate} strokeWidth="1.2" strokeOpacity="0.3" />
        {/* Screen */}
        <rect x={w * 0.01} y={h * 0.01} width={w * 0.16} height={h * 0.09} rx="3" fill={isDark ? '#0f172a' : '#f1f5f9'} />
        {/* Chart bars */}
        <rect x={w * 0.03} y={h * 0.04} width={w * 0.02} height={h * 0.04} rx="1" fill="url(#blueGrad)" />
        <rect x={w * 0.06} y={h * 0.03} width={w * 0.02} height={h * 0.05} rx="1" fill="url(#emeraldGrad)" />
        <rect x={w * 0.09} y={h * 0.035} width={w * 0.02} height={h * 0.045} rx="1" fill="url(#goldGrad)" />
        <rect x={w * 0.12} y={h * 0.045} width={w * 0.02} height={h * 0.035} rx="1" fill={slate} opacity="0.4" />
        {/* Monitor stand */}
        <rect x={w * 0.075} y={h * 0.12} width={w * 0.03} height={h * 0.015} rx="1" fill={slate} opacity="0.5" />
        <rect x={w * 0.06} y={h * 0.135} width={w * 0.06} height={h * 0.008} rx="1" fill={slate} opacity="0.5" />
      </g>

      {/* ===== FLOATING ELEMENTS ===== */}
      {/* Gold star */}
      <g transform={`translate(${w * 0.85}, ${h * 0.2})`} className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '5s', animationDelay: '0.5s' } : {}}>
        <polygon
          points={`0,${h * -0.02} ${w * 0.005},${h * -0.005} ${w * 0.015},${h * -0.005} ${w * 0.007},${h * 0.003} ${w * 0.01},${h * 0.015} 0,${h * 0.008} ${w * -0.01},${h * 0.015} ${w * -0.007},${h * 0.003} ${w * -0.015},${h * -0.005} ${w * -0.005},${h * -0.005}Z`}
          fill={gold}
        />
      </g>

      {/* Floating document */}
      <g transform={`translate(${w * 0.15}, ${h * 0.2})`} className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '7s', animationDelay: '1.5s' } : {}}>
        <rect x="0" y="0" width={w * 0.04} height={h * 0.05} rx="3" fill={card} stroke={slate} strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1={w * 0.008} y1={h * 0.015} x2={w * 0.032} y2={h * 0.015} stroke={slate} strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1={w * 0.008} y1={h * 0.025} x2={w * 0.032} y2={h * 0.025} stroke={slate} strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1={w * 0.008} y1={h * 0.035} x2={w * 0.025} y2={h * 0.035} stroke={slate} strokeWidth="0.8" strokeOpacity="0.4" />
      </g>

      {/* Checkmark circle */}
      <g transform={`translate(${w * 0.82}, ${h * 0.55})`} className={animated ? 'animate-float' : ''} style={animated ? { animationDuration: '6.5s', animationDelay: '2s' } : {}}>
        <circle cx="0" cy="0" r={w * 0.015} fill="url(#emeraldGrad)" opacity="0.9" />
        <path d={`M${w * -0.006} 0 L${w * -0.002} ${h * 0.006} L${w * 0.007} ${h * -0.005}`} stroke={card} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Small road/path */}
      <path
        d={`M${w * 0.3} ${h * 0.85} L${w * 0.5} ${h * 0.7} L${w * 0.7} ${h * 0.85}`}
        stroke={slate}
        strokeWidth="2"
        strokeOpacity="0.2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
};
