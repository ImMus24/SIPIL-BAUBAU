import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
  divider?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  /** Hide the chevron (used for avatar menus) */
  showChevron?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className,
  showChevron = true,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [highlighted, setHighlighted] = useState(-1);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      const item = items[highlighted];
      if (item && !item.disabled) {
        item.onClick();
        setOpen(false);
      }
    }
  };

  return (
    <div ref={ref} className={cn('relative inline-block', className)} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-ring rounded-lg"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {trigger}
        {showChevron && (
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'absolute top-full mt-1.5 min-w-[200px] bg-card border border-border rounded-xl shadow-xl py-1 z-50',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.divider && idx > 0 && <div className="my-1 border-t border-border" />}
                <button
                  role="menuitem"
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setOpen(false);
                    }
                  }}
                  onMouseEnter={() => setHighlighted(idx)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium transition-colors',
                    item.variant === 'danger' && 'text-danger hover:bg-danger-bg',
                    item.variant === 'success' && 'text-success hover:bg-success-bg',
                    !item.variant && 'text-foreground hover:bg-muted',
                    item.disabled && 'opacity-40 cursor-not-allowed',
                    highlighted === idx && 'bg-muted',
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
