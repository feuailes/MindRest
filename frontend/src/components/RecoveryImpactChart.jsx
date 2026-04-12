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
    labels: ['Active Days (Mind Games/Exercise)', 'Quiet Days (Assessments Only)'],
    datasets: [
      {
        label: 'Average Mood Score',
        data: [data?.activity_avg || 0, data?.neutral_avg || 0],
        backgroundColor: (context) => {
            const index = context.dataIndex;
            return index === 0 ? '#264653' : '#94A3B840';
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
        grid: { color: '#F1F5F9' },
        ticks: { color: '#94A3B8', font: { weight: '700' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { weight: '800', size: 11 } }
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
