import { motion } from 'framer-motion';

// A single circle stat
const StatCircle = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex flex-col items-center">
    <svg className="w-20 h-20" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
      <motion.circle
        cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={100 - value}
        initial={{ strokeDashoffset: 100 }}
        animate={{ strokeDashoffset: 100 - value }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
    <p className="mt-2 text-sm font-semibold">{label}</p>
  </div>
);

// The container for the three main stats
export default function QuickStats({ data }: { data: { strain: number; recovery: number; sleep: number } }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      <StatCircle value={data.strain} label="Strain" color="#f97316" />
      <StatCircle value={data.recovery} label="Recovery" color="#22c55e" />
      <StatCircle value={data.sleep} label="Sleep" color="#8b5cf6" />
    </div>
  );
}
