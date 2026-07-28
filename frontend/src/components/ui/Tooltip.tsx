import React, { useState } from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={clsx('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={clsx(
            'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg shadow-lg whitespace-nowrap animate-fade-in pointer-events-none',
            positionClasses[position]
          )}
        >
          {content}
          <div
            className={clsx(
              'absolute w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45',
              position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
              position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
              position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
              position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1'
            )}
          />
        </div>
      )}
    </div>
  );
};
