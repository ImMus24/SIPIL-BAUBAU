import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface RadialChartProps {
  series: number[];
  labels: string[];
  height?: number;
  colors?: string[];
  title?: string;
}

export const RadialChart: React.FC<RadialChartProps> = ({
  series,
  labels,
  height = 280,
  colors = ['#0B5ED7', '#16A34A', '#FFC107'],
  title,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'radialBar',
        height,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
        background: 'transparent',
      },
      series,
      colors,
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: -140,
          endAngle: 140,
          hollow: {
            size: '35%',
            background: 'transparent',
          },
          track: {
            background: isDark ? '#1e293b' : '#f1f5f9',
            strokeWidth: '100%',
          },
          dataLabels: {
            name: {
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: isDark ? '#94a3b8' : '#64748b',
              offsetY: -10,
            },
            value: {
              fontSize: '22px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              color: isDark ? '#f8fafc' : '#0f172a',
              offsetY: 5,
              formatter: (val: number) => val + '%',
            },
          },
        },
      },
      labels,
      legend: { show: false },
      tooltip: { theme: isDark ? 'dark' : 'light' },
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
          plotOptions: {
            radialBar: {
              track: { background: isDark ? '#1e293b' : '#f1f5f9' },
              dataLabels: {
                name: { color: isDark ? '#94a3b8' : '#64748b' },
                value: { color: isDark ? '#f8fafc' : '#0f172a' },
              },
            },
          },
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

export default RadialChart;
