import React, { useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';
import { exportCSV } from '../../lib/export';
import { Pagination } from './Pagination';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Hide column on small screens */
  hideOnMobile?: boolean;
}

export interface FilterChip<T> {
  id: string;
  label: string;
  /** Optional badge count shown next to label */
  count?: number;
  /** Filter predicate */
  test: (item: T) => boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  /** Enable built-in toolbar: search + filters + export */
  toolbar?: boolean;
  searchPlaceholder?: string;
  /** Fields searched when toolbar search is used */
  searchKeys?: (keyof T & string)[];
  filters?: FilterChip<T>[];
  /** Column key used for initial sort */
  initialSortBy?: string;
  /** Value accessor for CSV export (defaults to item[key]) */
  exportColumns?: { key: string; header: string }[];
  exportFilename?: string;
  rowClick?: (item: T) => void;
  selectedIds?: Set<string | number>;
  onSelect?: (id: string | number) => void;
  onSelectAll?: () => void;
  stickyHeader?: boolean;
  emptyMessage?: string;
  className?: string;
  /** Initial page size */
  pageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  loadingRows?: number;
}

function getValue(item: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, item);
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  toolbar = false,
  searchPlaceholder = 'Cari...',
  searchKeys = [],
  filters,
  initialSortBy,
  exportColumns,
  exportFilename = 'data',
  rowClick,
  selectedIds,
  onSelect,
  onSelectAll,
  stickyHeader = true,
  emptyMessage = 'Tidak ada data',
  className,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  loading = false,
  loadingRows = 6,
}: TableProps<T>) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filtered = useMemo(() => {
    let rows = [...data];

    if (activeFilter && filters) {
      const filter = filters.find((f) => f.id === activeFilter);
      if (filter) rows = rows.filter(filter.test);
    }

    if (search.trim() && searchKeys.length > 0) {
      const q = search.toLowerCase();
      rows = rows.filter((item) =>
        searchKeys.some((key) =>
          String(getValue(item, key as string) ?? '').toLowerCase().includes(q),
        ),
      );
    }

    if (sortBy) {
      rows.sort((a, b) => {
        const va = getValue(a, sortBy);
        const vb = getValue(b, sortBy);
        let cmp = 0;
        if (typeof va === 'number' && typeof vb === 'number') {
          cmp = va - vb;
        } else {
          cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'id');
        }
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, activeFilter, filters, search, searchKeys, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleExport = () => {
    const cols = exportColumns ?? columns.map((c) => ({ key: c.key, header: c.header }));
    exportCSV(
      exportFilename,
      filtered.map((item) => {
        const row: Record<string, unknown> = {};
        cols.forEach((c) => { row[c.key] = getValue(item, c.key); });
        return row;
      }),
      cols,
    );
  };

  const renderSortIcon = (key: string) => {
    if (sortBy !== key) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80" aria-hidden="true" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
      : <ArrowDown className="w-3.5 h-3.5 text-primary" aria-hidden="true" />;
  };

  if (loading) {
    return (
      <div className={cn('bg-card border border-border rounded-2xl overflow-hidden', className)}>
        <div className="p-6 space-y-4">
          {[...Array(loadingRows)].map((_, i) => (
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
      <div className={cn('bg-card border border-border rounded-2xl p-12 text-center', className)}>
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-foreground font-semibold">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-card border border-border rounded-2xl overflow-hidden', className)}>
      {/* Toolbar */}
      {toolbar && (
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/25 focus:border-ring transition-all"
              />
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted hover:border-primary/30 transition-all"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Ekspor CSV
            </button>
          </div>

          {filters && filters.length > 0 && (
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter">
              <button
                onClick={() => { setActiveFilter(null); setPage(1); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  activeFilter === null
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                Semua
                <span className="ml-1.5 opacity-70">{data.length}</span>
              </button>
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setActiveFilter(activeFilter === f.id ? null : f.id); setPage(1); }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    activeFilter === f.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {f.label}
                  {f.count !== undefined && <span className="ml-1.5 opacity-70">{f.count}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn('border-b border-border bg-muted/40', stickyHeader && 'sticky top-0 z-10')}>
              {onSelect && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds?.size === data.length}
                    onChange={onSelectAll}
                    aria-label="Pilih semua"
                    className="rounded border-border text-primary focus:ring-ring"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none group hover:text-foreground',
                    col.hideOnMobile && 'hidden md:table-cell',
                  )}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  aria-sort={col.sortable && sortBy === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && renderSortIcon(col.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelect ? 1 : 0)} className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">Tidak ada data yang cocok dengan pencarian/filter.</p>
                </td>
              </tr>
            ) : pageRows.map((item) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds?.has(id);
              return (
                <tr
                  key={id}
                  className={cn(
                    'transition-colors duration-100',
                    rowClick && 'cursor-pointer',
                    isSelected ? 'bg-primary-light/50' : 'hover:bg-muted/40',
                  )}
                  onClick={() => rowClick?.(item)}
                >
                  {onSelect && (
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => onSelect(id)}
                        aria-label="Pilih baris"
                        className="rounded border-border text-primary focus:ring-ring"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-sm text-foreground',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.hideOnMobile && 'hidden md:table-cell',
                      )}
                    >
                      {col.render ? col.render(item) : getValue(item, col.key) as React.ReactNode}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="px-4 border-t border-border">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            totalItems={filtered.length}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      )}
    </div>
  );
}
