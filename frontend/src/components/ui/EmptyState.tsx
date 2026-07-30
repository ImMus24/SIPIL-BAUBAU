import React from 'react';
import { clsx } from 'clsx';
import { Plus, RefreshCw, Inbox, SearchX, FileQuestion } from 'lucide-react';
import { Button } from './Button';
import type { IllustrationProps } from '../../assets/illustrations';

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'file';
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
  /** Custom illustration component to replace the default icon */
  illustration?: React.ComponentType<IllustrationProps>;
  /** Illustration variant (light/dark) */
  illustrationVariant?: 'light' | 'dark';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionText,
  actionLink,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className,
  illustration: IllustrationComponent,
  illustrationVariant = 'light',
}) => {
  const iconMap = { inbox: Inbox, search: SearchX, file: FileQuestion };
  const IconComponent = iconMap[icon];

  return (
    <div className={clsx('text-center py-16 px-8 bg-card border border-border rounded-2xl shadow-sm', className)}>
      {IllustrationComponent ? (
        <div className="w-40 h-40 mx-auto mb-5">
          <IllustrationComponent
            variant={illustrationVariant}
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
          <IconComponent className="w-10 h-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="font-heading text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">{description}</p>

      {actionText && (
        <div className="flex items-center justify-center gap-3">
          {actionLink ? (
            <a
              href={actionLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {actionText}
            </a>
          ) : (
            <Button variant="primary" icon={Plus} onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button variant="outline" icon={RefreshCw} onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
