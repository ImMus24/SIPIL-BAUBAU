import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface BarChartProps {
  series: { name: string; data: number[] }[];
  categories: string[];
  height?: number;
  colors?: string[];
  title?: string;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  series,
  categories,
  height = 300,
  colors = ['#3b82f6'],
  title,
  horizontal = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'bar',
        height,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
        background: 'transparent',
        foreColor: isDark ? '#94a3b8' : '#64748b',
      },
      series,
      colors,
      plotOptions: {
        bar: {
          horizontal,
          borderRadius: 4,
          columnWidth: '60%',
        },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: isDark ? '#334155' : '#e2e8f0',
        strokeDashArray: 3,
        padding: { left: 0, right: 0 },
      },
      xaxis: {
        categories,
        labels: { style: { colors: isDark ? '#94a3b8' : '#64748b', fontSize: '11px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: isDark ? '#94a3b8' : '#64748b', fontSize: '11px' } },
        min: 0,
      },
      tooltip: { theme: isDark ? 'dark' : 'light' },
      legend: {
        position: 'bottom',
        labels: { colors: isDark ? '#94a3b8' : '#64748b' },
      },
    };

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [series, categories, height, colors, horizontal]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (chartInstance.current) {
        const isDark = document.documentElement.classList.contains('dark');
        chartInstance.current.updateOptions({
          chart: { foreColor: isDark ? '#94a3b8' : '#64748b' },
          grid: { borderColor: isDark ? '#334155' : '#e2e8f0' },
          xaxis: { labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } } },
          yaxis: { labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } } },
          tooltip: { theme: isDark ? 'dark' : 'light' },
          legend: { labels: { colors: isDark ? '#94a3b8' : '#64748b' } },
        });
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {title && <h3 className="font-heading font-bold text-foreground mb-4">{title}</h3>}
      <div ref={chartRef} />
    </div>
  );
};

export default BarChart;
