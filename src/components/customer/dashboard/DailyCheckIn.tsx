// src/components/customer/dashboard/DailyCheckIn.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Droplets, BatteryFull, Smile, Moon } from 'lucide-react';

/*
TODO: Backend Integration Notes for DailyCheckIn
- `isAlreadyCheckedIn`: Query `daily_logs` for a record with the current user's ID and today's date.
- `handleLogCheckIn`: On button click, INSERT a new row into `daily_logs` with the selected values.
*/
const mockData = {
  isAlreadyCheckedIn: false,
};

// --- Data for the interactive selectors ---
const sleepOptions = [ { value: 1, emoji: '😴' }, { value: 2, emoji: '🥱' }, { value: 3, emoji: '😐' }, { value: 4, emoji: '😌' }, { value: 5, emoji: '🤩' }];
const energyOptions = [ { value: 1, emoji: '🪫' }, { value: 2, emoji: '🔋' }, { value: 3, emoji: '⚡️' }, { value: 4, emoji: '🚀' }];
const moodOptions = [ { value: 1, emoji: '😩' }, { value: 2, emoji: '😕' }, { value: 3, emoji: '😐' }, { value: 4, emoji: '😊' }, { value: 5, emoji: '😁' }];

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
        {/* --- 2x2 Grid for Check-in Modules --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WaterModule value={water} onChange={setWater} />
          <SleepModule value={sleep} onChange={setSleep} />
          <EnergyModule value={energy} onChange={setEnergy} />
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

const WaterModule = ({ value, onChange }) => (
  <Card className="bg-gray-50/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <Droplets className="text-blue-500" /> Water Intake
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1 === value ? i : i + 1)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110",
              i < value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            )}
          >
            <Droplets size={16} />
          </button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SleepModule = ({ value, onChange }) => (
  <Card className="bg-gray-50/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <Moon className="text-indigo-500" /> Sleep Quality
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmojiSelector options={sleepOptions} value={value} onChange={onChange} />
    </CardContent>
  </Card>
);

const EnergyModule = ({ value, onChange }) => (
  <Card className="bg-gray-50/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <BatteryFull className="text-green-500" /> Energy Level
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmojiSelector options={energyOptions} value={value} onChange={onChange} />
    </CardContent>
  </Card>
);

const MoodModule = ({ value, onChange }) => (
  <Card className="bg-gray-50/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <Smile className="text-yellow-500" /> Mood
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EmojiSelector options={moodOptions} value={value} onChange={onChange} />
    </CardContent>
  </Card>
);

const EmojiSelector = ({ options, value, onChange }) => (
  <div className="flex justify-between items-center pt-2">
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className="transition-transform duration-200 ease-out hover:scale-125"
      >
        <span className={cn("text-3xl transition-all duration-200", value === option.value ? 'opacity-100 scale-110' : 'opacity-40 grayscale hover:opacity-75')}>
          {option.emoji}
        </span>
      </button>
    ))}
  </div>
);

export default DailyCheckIn;
