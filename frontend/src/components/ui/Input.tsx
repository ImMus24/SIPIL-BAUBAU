import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  charCount?: boolean;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  icon,
  rightIcon,
  charCount,
  maxLength,
  className,
  id,
  value,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-foreground"
        >
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          value={value}
          className={clsx(
            'w-full rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/60 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
            icon ? 'pl-10' : 'pl-4',
            rightIcon || charCount ? 'pr-10' : 'pr-4',
            error ? 'border-danger focus:ring-danger' : 'border-input',
            props.disabled && 'opacity-50 cursor-not-allowed bg-muted',
            props.size === 'sm' ? 'py-2 text-sm' : 'py-2.5 text-sm',
            className
          )}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
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
        {charCount && maxLength && typeof value === 'string' && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
