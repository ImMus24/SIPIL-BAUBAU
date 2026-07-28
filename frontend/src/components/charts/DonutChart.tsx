import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface DonutChartProps {
  series: number[];
  labels: string[];
  height?: number;
  colors?: string[];
  title?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  series,
  labels,
  height = 300,
  colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
  title,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'donut',
        height,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
        background: 'transparent',
        foreColor: isDark ? '#94a3b8' : '#64748b',
      },
      series,
      labels,
      colors,
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                color: isDark ? '#f8fafc' : '#0f172a',
                formatter: () => series.reduce((a, b) => a + b, 0).toString(),
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
        labels: { colors: isDark ? '#94a3b8' : '#64748b' },
        markers: { size: 8, offsetX: 0, offsetY: 0 },
      },
      tooltip: { theme: isDark ? 'dark' : 'light' },
      responsive: [{ breakpoint: 480, options: { chart: { height: 250 }, legend: { position: 'bottom' } } }],
    };

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [series, labels, height, colors]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (chartInstance.current) {
        const isDark = document.documentElement.classList.contains('dark');
        chartInstance.current.updateOptions({
          chart: { foreColor: isDark ? '#94a3b8' : '#64748b' },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: { color: isDark ? '#f8fafc' : '#0f172a' },
                },
              },
            },
          },
          legend: { labels: { colors: isDark ? '#94a3b8' : '#64748b' } },
          tooltip: { theme: isDark ? 'dark' : 'light' },
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

export default DonutChart;
