/**
 * Export helpers — CSV + image downloads.
 */

export function exportCSV(
  filename: string,
  rows: Record<string, unknown>[],
  columns: { key: string; header: string }[],
): void {
  if (rows.length === 0) return;

  const escape = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.map((c) => escape(c.header)).join(',');
  const body = rows.map((row) => columns.map((c) => escape(row[c.key])).join(','));

  const csv = [header, ...body].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface ChartLike {
  dataURI?: (options?: { scale?: number; width?: number }) => Promise<
    { imgURI?: string; dataURI?: string; blob?: Blob } | string
  >;
}

/** Trigger PNG download from an ApexCharts instance. */
export async function downloadChartImage(
  chart: ChartLike | null | undefined,
  filename: string,
): Promise<void> {
  if (!chart?.dataURI) return;
  try {
    const result = await chart.dataURI({ scale: 2 });
    const dataUri = typeof result === 'string'
      ? result
      : (result as { dataURI?: string })?.dataURI ?? (result as { imgURI?: string })?.imgURI;
    if (!dataUri) return;
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    /* chart export failed silently — user can screenshot */
  }
}

/** Format bytes into a human readable string. */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
