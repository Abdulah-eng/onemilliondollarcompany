// src/components/customer/dashboard/DailyCheckIn.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Droplets, BatteryFull, Smile, Moon, TrendingUp, TrendingDown } from 'lucide-react';

/*
TODO: Backend Integration Notes for DailyCheckIn
- `isAlreadyCheckedIn`: Query `daily_logs` for a record with the current user's ID and today's date.
- `handleLogCheckIn`: On button click, INSERT a new row into `daily_logs` with the selected values.
- `trends`: The trend data (e.g., energyTrend) needs to be calculated by comparing the average of the last few days' logs with the previous period.
*/
const mockData = {
  isAlreadyCheckedIn: false,
  trends: {
    energyTrend: 'up', // 'up', 'down', 'stable'
  }
};

// --- Data for the interactive selectors with detailed feedback ---
const sleepOptions = [
  { value: 1, emoji: '😴', feedback: 'Tip: Try to avoid screens 30 minutes before bed.' },
  { value: 2, emoji: '🥱', feedback: 'Tip: A consistent bedtime can dramatically improve sleep.' },
  { value: 3, emoji: '😐', feedback: 'A decent night. Let\'s aim for great tomorrow!' },
  { value: 4, emoji: '😌', feedback: 'Great! Good sleep boosts recovery and mood.' },
  { value: 5, emoji: '🤩', feedback: 'Excellent! You\'re set up for a peak performance day.' },
];
const energyOptions = [
  { value: 1, emoji: '🪫', label: 'Very Low', feedback: 'Trend: Up 5% from last week! Keep it up.' },
  { value: 2, emoji: '🔋', label: 'Low', feedback: 'Tip: A short walk can often boost energy levels.' },
  { value: 3, emoji: '⚡️', label: 'Good', feedback: 'Benefit: High energy improves focus and workout quality.' },
  { value: 4, emoji: '🚀', label: 'High', feedback: 'Amazing! You\'re ready to crush your goals today.' },
];
const moodOptions = [
  { value: 1, emoji: '😩', label: 'Awful', feedback: 'It\'s okay to have off days. Be kind to yourself.' },
  { value: 2, emoji: '😕', label: 'Bad', feedback: 'Tip: A few minutes of mindfulness can help reset your day.' },
  { value: 3, emoji: '😐', label: 'Okay', feedback: 'A neutral mood is a great foundation to build on.' },
  { value: 4, emoji: '😊', label: 'Good', feedback: 'Benefit: A positive mood is linked to better health outcomes.' },
  { value: 5, emoji: '😁', label: 'Great!', feedback: 'Awesome! Let this positivity fuel your day.' },
];

const DailyCheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(mockData.isAlreadyCheckedIn);
  const [water, setWater] = useState(4);
  const [sleep, setSleep] = useState(4);
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(4);

  const handleLogCheckIn = () => {
    console.log({ water, sleep, energy, mood });
    setCheckedIn(true);
  };

  if (checkedIn) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
        <CardContent className="p-6 text-center flex flex-col items-center gap-2">
          <Check className="w-10 h-10 bg-white/20 text-white rounded-full p-2"/>
          <h3 className="text-xl font-bold">Thanks for checking in today!</h3>
          <p className="opacity-90 mt-1">Your progress has been logged.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 text-center">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WaterModule value={water} onChange={setWater} />
          <SleepModule value={sleep} onChange={setSleep} />
          <EnergyModule value={energy} onChange={setEnergy} trend={mockData.trends.energyTrend} />
          <MoodModule value={mood} onChange={setMood} />
        </div>
        
        <div className="pt-4">
            <Button onClick={handleLogCheckIn} className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6 font-bold">
              Log Today's Check-in
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Modular Check-in Components ---

const WaterModule = ({ value, onChange }) => {
    const feedback = value < 4 ? "Tip: Try to drink at least 8 glasses (2.5L) per day." : "Great job hydrating! This is key for energy.";
    return (
        <CheckInModule icon={<Droplets className="text-blue-500" />} title="Water Intake" feedback={feedback}>
            <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                <button key={i} onClick={() => onChange(i + 1 === value ? i : i + 1)} className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110", i < value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400')}>
                    <Droplets size={16} />
                </button>
                ))}
            </div>
        </CheckInModule>
    );
};

const SleepModule = ({ value, onChange }) => (
  <CheckInModule icon={<Moon className="text-indigo-500" />} title="Sleep Quality" feedback={sleepOptions[value - 1].feedback}>
    <EmojiSelector options={sleepOptions} value={value} onChange={onChange} />
  </CheckInModule>
);

const EnergyModule = ({ value, onChange, trend }) => {
    const trendIcon = trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-red-500" />;
    const trendText = `Trend: ${trend === 'up' ? 'Improving' : 'Declining'}`;
    const feedback = energyOptions[value - 1].feedback;
    return (
        <CheckInModule icon={<BatteryFull className="text-green-500" />} title="Energy Level" feedback={feedback} trend={{icon: trendIcon, text: trendText}}>
            <EmojiSelector options={energyOptions} value={value} onChange={onChange} />
        </CheckInModule>
    );
};

const MoodModule = ({ value, onChange }) => (
  <CheckInModule icon={<Smile className="text-yellow-500" />} title="Mood" feedback={moodOptions[value - 1].feedback}>
    <EmojiSelector options={moodOptions} value={value} onChange={onChange} />
  </CheckInModule>
);

// --- Reusable Building Blocks ---

const CheckInModule = ({ icon, title, feedback, trend, children }) => (
  <Card className="bg-gray-50/50 flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        {icon} {title}
        {trend && <span className="ml-auto flex items-center gap-1 text-xs font-medium text-gray-500">{trend.icon} {trend.text}</span>}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col justify-between">
        {children}
        <FeedbackMessage text={feedback} />
    </CardContent>
  </Card>
);

const EmojiSelector = ({ options, value, onChange }) => (
  <div className="flex justify-between items-center pt-2">
    {options.map((option) => (
      <button key={option.value} onClick={() => onChange(option.value)} className="transition-transform duration-200 ease-out hover:scale-125">
        <span className={cn("text-3xl transition-all duration-200", value === option.value ? 'opacity-100 scale-110' : 'opacity-40 grayscale hover:opacity-75')}>
          {option.emoji}
        </span>
      </button>
    ))}
  </div>
);

const FeedbackMessage = ({ text }) => (
    <p key={text} className="text-xs text-gray-500 italic text-center mt-3 h-8 animate-fade-in">
        {text}
    </p>
);

export default DailyCheckIn;
