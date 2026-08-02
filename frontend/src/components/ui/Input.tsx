import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  charCount?: boolean;
  maxLength?: number;
  /** Floating label mode — label moves inside the field */
  floating?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  success,
  icon,
  rightIcon,
  charCount,
  maxLength,
  floating = false,
  className,
  id,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== ''
    || defaultValue !== undefined && defaultValue !== '';

  const isFloating = floating && !!label;
  const labelActive = isFloating && (focused || hasValue);

  return (
    <div className="space-y-1.5">
      <div className="relative">
        {/* Floating label */}
        {isFloating && (
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 origin-left z-[1]',
              'text-muted-foreground bg-transparent px-1',
              labelActive
                ? 'text-[11px] font-semibold -top-1 translate-y-0 scale-95 text-primary bg-card rounded-sm'
                : 'text-sm',
              error && labelActive && 'text-danger',
              success && labelActive && 'text-success',
            )}
          >
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}

        {/* Static label */}
        {!isFloating && label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-foreground mb-1.5">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}

        {icon && (
          <div className={cn(
            'absolute left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground z-[1]',
            isFloating ? 'inset-y-0' : 'top-[calc(50%+10px)] -translate-y-1/2',
          )}>
            {icon}
          </div>
        )}

        <input
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            'w-full rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/50 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-ring/25 focus:border-ring',
            icon ? 'pl-10' : isFloating ? 'pl-3.5' : 'pl-4',
            (rightIcon || charCount) ? 'pr-10' : 'pr-4',
            error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-input',
            success && !error ? 'border-success focus:ring-success/20 focus:border-success' : '',
            props.disabled && 'opacity-50 cursor-not-allowed bg-muted',
            isFloating ? 'pt-5 pb-1.5 text-sm' : (String(props.size) === 'sm' ? 'py-2 text-sm' : 'py-2.5 text-sm'),
            className,
          )}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
        />

        {rightIcon && (
          <div className={cn(
            'absolute right-0 flex items-center pr-3.5 text-muted-foreground z-[1]',
            isFloating ? 'inset-y-0' : 'top-[calc(50%+10px)] -translate-y-1/2',
          )}>
            {rightIcon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-start gap-1">
          {error ? (
            <AlertCircle className="w-3.5 h-3.5 text-danger mt-0.5 shrink-0" aria-hidden="true" />
          ) : success ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" aria-hidden="true" />
          ) : null}
          <div className="flex-1">
            {error && (
              <p id={`${inputId}-error`} className="text-xs font-medium text-danger" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={`${inputId}-helper`} className="text-xs text-muted-foreground">
                {helperText}
              </p>
            )}
          </div>
        </div>
        {charCount && maxLength && typeof value === 'string' && (
          <span className="text-xs text-muted-foreground tabular-nums ml-2">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
