import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

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
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-foreground mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          id={textareaId}
          value={value}
          className={cn(
            'w-full rounded-xl border bg-card text-foreground placeholder:text-muted-foreground/50 transition-all duration-150 resize-y min-h-[100px]',
            'focus:outline-none focus:ring-2 focus:ring-ring/25 focus:border-ring',
            'px-4 py-2.5 text-sm',
            error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-input',
            props.disabled && 'opacity-50 cursor-not-allowed bg-muted',
            className,
          )}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-start gap-1">
          {error && <AlertCircle className="w-3.5 h-3.5 text-danger mt-0.5 shrink-0" aria-hidden="true" />}
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-xs font-medium text-danger" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-xs text-muted-foreground">{helperText}</p>
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
