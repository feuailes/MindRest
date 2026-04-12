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

const ScreenExhaustionChart = ({ history, currentPoint }) => {
  // Format history data: X = Screen Time, Y = Exhaustion Score
  const historicalPoints = (history || []).map(h => ({
    x: h.screen_time,
    y: (h.sleep_hours + h.stress_level + h.screen_time + h.mood_rating) / 4,
    date: new Date(h.created_at).toLocaleDateString()
  }));

  const data = {
    datasets: [
      {
        label: 'Current Status',
        data: [currentPoint],
        backgroundColor: '#E76F51',
        pointRadius: 12,
        pointHoverRadius: 15,
        pointBorderColor: '#fff',
        pointBorderWidth: 4,
        zIndex: 10,
      },
      {
        label: 'Past Assessments',
        data: historicalPoints,
        backgroundColor: '#26465330',
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBorderColor: '#26465320',
        pointBorderWidth: 1,
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
          text: 'Screen Time (Hours)',
          color: '#94A3B8',
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
          text: 'Exhaustion Level',
          color: '#94A3B8',
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
            const label = context.dataset.label;
            return [
              `${label}`,
              `Screen: ${p.x}h`,
              `Exhaustion: ${p.y.toFixed(1)}/10`,
              p.date ? `Date: ${p.date}` : 'Now'
            ];
          }
        }
      }
    },
  };

  return (
    <div style={{ width: '100%', height: '220px', marginTop: '10px' }}>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ScreenExhaustionChart;
