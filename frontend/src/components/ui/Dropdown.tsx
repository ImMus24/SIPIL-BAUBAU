import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
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
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className={clsx('relative inline-block', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          className={clsx(
            'absolute top-full mt-1.5 min-w-[200px] bg-card border border-border rounded-xl shadow-xl py-1 z-50 animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.divider && idx > 0 && <div className="my-1 border-t border-border" />}
              <button
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium transition-colors',
                  item.variant === 'danger' && 'text-danger hover:bg-danger-bg',
                  item.variant === 'success' && 'text-success hover:bg-success-bg',
                  !item.variant && 'text-foreground hover:bg-muted',
                  item.disabled && 'opacity-40 cursor-not-allowed'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
