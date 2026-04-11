import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const CorrelationChart = ({ history }) => {
  const dataPoints = history?.correlation_data || [];

  const data = {
    datasets: [
      {
        label: 'Mood vs Sleep Correlation',
        data: dataPoints,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, '#E76F51'); // Low Mood - Orange/Red
          gradient.addColorStop(0.5, '#F4A261'); // Mid
          gradient.addColorStop(1, '#2A9D8F'); // High Mood - Teal
          return gradient;
        },
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sleep Hours',
          color: '#64748B',
          font: { weight: '800', size: 10 }
        },
        grid: { color: '#F1F5F9' },
        ticks: { color: '#94A3B8' },
        min: 0,
        max: 12,
      },
      y: {
        title: {
          display: true,
          text: 'Mood Score (1-10)',
          color: '#64748B',
          font: { weight: '800', size: 10 }
        },
        grid: { color: '#F1F5F9' },
        ticks: { color: '#94A3B8' },
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const p = context.raw;
            return [`Date: ${p.date}`, `Sleep: ${p.x}h`, `Mood: ${p.y}/10`];
          }
        }
      }
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default CorrelationChart;
