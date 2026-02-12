import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function MoodChart({ dataPoints }) {
  const data = {
    labels: dataPoints.map((_, i) => `Entry ${i+1}`),
    datasets: [
      {
        label: "Mood Score",
        data: dataPoints,
      },
    ],
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "auto" }}>
      <Line data={data} />
    </div>
  );
}
