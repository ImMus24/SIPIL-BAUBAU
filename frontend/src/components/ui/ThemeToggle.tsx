import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const modes: { value: ThemeMode; icon: React.ElementType; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Mode terang' },
  { value: 'dark', icon: Moon, label: 'Mode gelap' },
  { value: 'system', icon: Monitor, label: 'Ikuti sistem' },
];

interface ThemeToggleProps {
  /** Segmented control (3 buttons) vs compact cycle button */
  variant?: 'segmented' | 'cycle';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'segmented' }) => {
  const { mode, isDark, setMode } = useTheme();

  if (variant === 'cycle') {
    const next: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
    return (
      <button
        onClick={() => setMode(next)}
        className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title={`Mode saat ini: ${mode === 'light' ? 'Terang' : mode === 'dark' ? 'Gelap' : 'Sistem'} — klik untuk ganti`}
        aria-label={`Ganti mode tampilan (saat ini ${mode === 'light' ? 'terang' : mode === 'dark' ? 'gelap' : 'sistem'})`}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className="flex items-center p-1 bg-muted rounded-full border border-border"
      role="radiogroup"
      aria-label="Mode tampilan"
    >
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = mode === m.value;
        return (
          <button
            key={m.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => setMode(m.value)}
            title={m.label}
            aria-label={m.label}
            className={cn(
              'p-1.5 rounded-full transition-all relative',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`theme-indicator-${variant}`}
                className="absolute inset-0 bg-card shadow-sm rounded-full"
                transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
              />
            )}
            <Icon className="relative w-4 h-4 z-[1]" />
          </button>
        );
      })}
      <span className="sr-only" aria-live="polite">
        {mode === 'light' ? 'Terang' : mode === 'dark' ? 'Gelap' : 'Sistem'} — {isDark ? 'gelap aktif' : 'terang aktif'}
      </span>
    </div>
  );
};
