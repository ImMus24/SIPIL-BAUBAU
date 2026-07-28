import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface AreaChartProps {
  series: { name: string; data: number[] }[];
  categories: string[];
  height?: number;
  colors?: string[];
  title?: string;
  subtitle?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  series,
  categories,
  height = 300,
  colors = ['#3b82f6', '#22c55e'],
  title,
  subtitle,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'area',
        height,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        animations: { enabled: true, speed: 800, animateGradually: { enabled: true }, dynamicAnimation: { enabled: true } },
        zoom: { enabled: false },
        background: 'transparent',
        foreColor: isDark ? '#94a3b8' : '#64748b',
      },
      series,
      colors,
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.05,
        },
      },
      grid: {
        borderColor: isDark ? '#334155' : '#e2e8f0',
        strokeDashArray: 3,
        padding: { left: 0, right: 0 },
      },
      xaxis: {
        categories,
        labels: { style: { colors: isDark ? '#94a3b8' : '#64748b', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: isDark ? '#94a3b8' : '#64748b', fontSize: '12px' } },
        min: 0,
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        x: { format: 'dd MMM yyyy' },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: { colors: isDark ? '#94a3b8' : '#64748b' },
      },
    };

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [series, categories, height, colors]);

  // Observer for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (chartRef.current && chartInstance.current) {
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
      {title && <h3 className="font-heading font-bold text-foreground mb-1">{title}</h3>}
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div ref={chartRef} />
    </div>
  );
};

export default AreaChart;
