import React from 'react';
import { Inbox, SearchX, FileQuestion, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'file';
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  const iconMap = {
    inbox: Inbox,
    search: SearchX,
    file: FileQuestion,
  };

  const IconComponent = iconMap[icon];

  return (
    <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 flex items-center justify-center mx-auto text-sky-800 dark:text-sky-400">
        <IconComponent className="w-8 h-8" />
      </div>
      <div className="max-w-md mx-auto space-y-1.5">
        <h3 className="font-headline font-extrabold text-lg text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>

      {(actionText && (actionLink || onAction)) && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-800/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{actionText}</span>
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-800/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
