// src/components/coach/clientCard/ClientProgress/WeightTrend.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface WeightTrendProps {
  weightTrend: number[];
  nextFollowUp: string;
}

const WeightTrend: React.FC<WeightTrendProps> = ({ weightTrend, nextFollowUp }) => {
  const labels = weightTrend.map((_, i) => `Week ${i + 1}`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightTrend,
        borderColor: '#ef4444',
        backgroundColor: '#fca5a5',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
      <h4 className="font-semibold text-md text-foreground mb-2 text-center">Weight Trend</h4>
      <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      <p className="text-sm text-muted-foreground mt-2 text-center">Next Follow-up: {nextFollowUp}</p>
    </div>
  );
};

export default WeightTrend;
