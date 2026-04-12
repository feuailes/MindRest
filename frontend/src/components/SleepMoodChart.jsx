import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const SleepMoodChart = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'Sleep vs Mood',
        data: data || [],
        backgroundColor: '#8b5cf6',
        pointRadius: 8,
        pointHoverRadius: 10,
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
          text: 'Sleep (Hours)',
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
          text: 'Mood rating (0-10)',
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
            return [`Sleep: ${p.x}h`, `Mood: ${p.y}/10`];
          }
        }
      }
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default SleepMoodChart;
