import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onChange,
  orientation = 'horizontal',
  className,
}) => {
  return (
    <div
      className={clsx(
        orientation === 'horizontal' ? 'flex' : 'flex-col',
        'gap-0',
        className
      )}
      aria-label="Progress"
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isUpcoming = idx > currentStep;

        return (
          <div
            key={step.id}
            className={clsx(
              'flex',
              orientation === 'horizontal' ? 'flex-1 flex-col items-center' : 'items-start gap-4'
            )}
          >
            <div
              className={clsx(
                'flex items-center',
                orientation === 'horizontal' ? 'w-full' : 'flex-col'
              )}
            >
              {/* Step indicator */}
              <button
                onClick={() => onChange?.(idx)}
                disabled={isUpcoming}
                className={clsx(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-all duration-200 shrink-0',
                  isCompleted && 'bg-primary border-primary text-primary-foreground',
                  isCurrent && 'border-primary text-primary bg-primary-light',
                  isUpcoming && 'border-border text-muted-foreground bg-card cursor-not-allowed'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
              </button>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={clsx(
                    orientation === 'horizontal'
                      ? 'flex-1 h-0.5 mx-2 mt-0'
                      : 'w-0.5 h-8 ml-5',
                    'rounded-full transition-colors duration-200',
                    isCompleted ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div
              className={clsx(
                orientation === 'horizontal'
                  ? 'text-center mt-2'
                  : 'mt-0',
                isCurrent && 'text-foreground',
                isCompleted && 'text-muted-foreground',
                isUpcoming && 'text-muted-foreground/50'
              )}
            >
              <span className={clsx(
                'block text-sm font-semibold',
                isCurrent && 'text-primary'
              )}>
                {step.label}
              </span>
              {step.description && (
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {step.description}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
