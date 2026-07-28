import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  charCount,
  maxLength,
  className,
  id,
  value,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-foreground"
        >
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          id={textareaId}
          value={value}
          className={clsx(
            'w-full rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 resize-y min-h-[100px]',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
            'px-4 py-2.5 text-sm',
            error ? 'border-danger focus:ring-danger' : 'border-input',
            props.disabled && 'opacity-50 cursor-not-allowed bg-muted',
            className
          )}
          maxLength={maxLength}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {error && (
            <p className="text-xs font-medium text-danger" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-xs text-muted-foreground">{helperText}</p>
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
