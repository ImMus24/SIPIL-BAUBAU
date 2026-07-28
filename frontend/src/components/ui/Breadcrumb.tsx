import React from 'react';
import { clsx } from 'clsx';
import { ChevronRight, type LucideIcon, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center gap-1 text-sm', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const Icon = item.icon;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
            )}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            ) : (
              <span
                className={clsx(
                  'inline-flex items-center gap-1.5 font-semibold',
                  isLast ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const PageBreadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <Breadcrumb items={[{ label: 'Beranda', icon: Home, href: '/' }, ...items]} />
);
