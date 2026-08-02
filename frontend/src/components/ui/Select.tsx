import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className,
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-foreground mb-1.5">
          {label}
          {props.required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full rounded-xl border bg-card text-foreground transition-all duration-150 appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-ring/25 focus:border-ring',
            'pl-4 pr-10 py-2.5 text-sm',
            error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-input',
            props.disabled && 'opacity-50 cursor-not-allowed bg-muted',
            !props.value && 'text-muted-foreground/60',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-foreground bg-card">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-foreground">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-start gap-1">
        {error && <AlertCircle className="w-3.5 h-3.5 text-danger mt-0.5 shrink-0" aria-hidden="true" />}
        <div className="flex-1">
          {error && (
            <p id={`${selectId}-error`} className="text-xs font-medium text-danger" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-xs text-muted-foreground">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
};
