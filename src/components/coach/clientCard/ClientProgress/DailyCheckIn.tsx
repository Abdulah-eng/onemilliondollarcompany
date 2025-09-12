// src/components/coach/clientCard/ClientProgress/DailyCheckIn.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface DailyCheckInProps {
  dailyCheckIn: { water: number[]; energy: number[]; sleep: number[]; mood: number[] };
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ dailyCheckIn }) => {
  const labels = dailyCheckIn.water.map((_, i) => `Day ${i + 1}`);

  const data = {
    labels,
    datasets: [
      { label: 'Water', data: dailyCheckIn.water, borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.3 },
      { label: 'Energy', data: dailyCheckIn.energy, borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3 },
      { label: 'Sleep', data: dailyCheckIn.sleep, borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.3 },
      { label: 'Mood', data: dailyCheckIn.mood, borderColor: '#8b5cf6', backgroundColor: '#8b5cf6', tension: 0.3 },
    ],
  };

  return (
    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
      <h4 className="font-semibold text-md text-foreground mb-2 text-center">Daily Check-ins</h4>
      <Line data={data} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
    </div>
  );
};

export default DailyCheckIn;
