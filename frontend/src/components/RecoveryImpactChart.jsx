import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RecoveryImpactChart = ({ data }) => {
  const chartData = {
    labels: ['Active Days', 'Quiet Days'],
    datasets: [
      {
        label: 'Average Mood Score',
        data: [data?.activity_avg || 0, data?.neutral_avg || 0],
        backgroundColor: (context) => {
            const index = context.dataIndex;
            return index === 0 ? '#E76F51' : 'rgba(255, 255, 255, 0.2)';
        },
        borderRadius: 12,
        barThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { weight: '700' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.8)', font: { weight: '800', size: 11 } }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        padding: 12,
        backgroundColor: '#1e293b',
        titleFont: { size: 13, weight: '800' },
        bodyFont: { size: 12 },
        cornerRadius: 12,
        displayColors: false,
      }
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '220px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RecoveryImpactChart;
