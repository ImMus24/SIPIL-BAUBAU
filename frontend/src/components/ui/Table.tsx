import React from 'react';
import { clsx } from 'clsx';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  rowClick?: (item: T) => void;
  selectedIds?: Set<string | number>;
  onSelect?: (id: string | number) => void;
  onSelectAll?: () => void;
  stickyHeader?: boolean;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  sortBy,
  sortDir,
  onSort,
  loading,
  emptyMessage = 'Tidak ada data',
  rowClick,
  selectedIds,
  onSelect,
  onSelectAll,
  stickyHeader = true,
  className,
}: TableProps<T>) {
  const renderSortIcon = (key: string) => {
    if (sortBy !== key) return <span className="opacity-0 group-hover:opacity-40 ml-1">↕</span>;
    return <span className="ml-1 text-primary">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (loading) {
    return (
      <div className={clsx('bg-card border border-border rounded-2xl overflow-hidden', className)}>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-4 shimmer rounded"
                  style={{ width: col.width || '100%', flex: col.width ? 'none' : 1 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={clsx('bg-card border border-border rounded-2xl p-12 text-center', className)}>
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-muted-foreground text-2xl">inbox</span>
        </div>
        <p className="text-foreground font-semibold">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={clsx('bg-card border border-border rounded-2xl overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={clsx('border-b border-border bg-muted/50', stickyHeader && 'sticky top-0 z-10')}>
              {onSelect && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds?.size === data.length}
                    onChange={onSelectAll}
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none group hover:text-foreground'
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortable && renderSortIcon(col.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds?.has(id);
              return (
                <tr
                  key={id}
                  className={clsx(
                    'transition-colors duration-100',
                    rowClick && 'cursor-pointer',
                    isSelected ? 'bg-primary-light/50' : 'hover:bg-muted/50'
                  )}
                  onClick={() => rowClick?.(item)}
                >
                  {onSelect && (
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => onSelect(id)}
                        className="rounded border-border text-primary focus:ring-ring"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        'px-4 py-3 text-sm text-foreground',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
