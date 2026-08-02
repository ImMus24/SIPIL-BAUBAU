import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
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
      className={cn(orientation === 'horizontal' ? 'flex' : 'flex-col', className)}
      aria-label="Progress"
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isUpcoming = idx > currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              'flex',
              orientation === 'horizontal' ? 'flex-1 flex-col items-center' : 'items-start gap-4',
            )}
          >
            <div className={cn('flex items-center', orientation === 'horizontal' ? 'w-full' : 'flex-col')}>
              {/* Step indicator */}
              <button
                onClick={() => onChange?.(idx)}
                disabled={isUpcoming}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm transition-colors duration-200 shrink-0 focus-visible:outline-2 focus-visible:outline-ring',
                  isCompleted && 'bg-primary border-primary text-primary-foreground',
                  isCurrent && 'border-primary text-primary bg-primary-light',
                  isUpcoming && 'border-border text-muted-foreground bg-card cursor-not-allowed',
                )}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Langkah ${idx + 1}: ${step.label}`}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.35, bounce: 0.4 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.span>
                ) : (
                  idx + 1
                )}
                {isCurrent && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.35, 1.1], opacity: [0.6, 0, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    orientation === 'horizontal' ? 'flex-1 h-0.5 mx-2' : 'w-0.5 h-8 ml-5',
                    'rounded-full overflow-hidden bg-border',
                  )}
                >
                  <motion.div
                    className="h-full w-full bg-primary"
                    initial={false}
                    animate={{ width: isCompleted ? '100%' : '0%', height: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>

            {/* Label */}
            <div
              className={cn(
                orientation === 'horizontal' ? 'text-center mt-2' : '',
                isCurrent && 'text-foreground',
                isCompleted && 'text-muted-foreground',
                isUpcoming && 'text-muted-foreground/50',
              )}
            >
              <span className={cn('block text-sm font-semibold', isCurrent && 'text-primary')}>
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
