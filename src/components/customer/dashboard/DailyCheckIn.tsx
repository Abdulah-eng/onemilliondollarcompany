// src/components/customer/dashboard/DailyCheckIn.tsx
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, Droplets, BatteryFull, Smile, Moon } from 'lucide-react';

/*
TODO: Backend Integration Notes for DailyCheckIn
- `isAlreadyCheckedIn`: Query `daily_logs` for a record with the current user's ID and today's date.
- `handleLogCheckIn`: On button click, INSERT a new row into `daily_logs` with the selected values.
- The feedback messages (e.g., "5% better than last week") will require fetching and comparing historical data from the `daily_logs` table.
*/
const mockData = {
  isAlreadyCheckedIn: false,
};

// --- Data for the interactive selectors with labels and feedback ---
const sleepOptions = [
  { value: 1, emoji: '😴', label: 'Poor', feedback: 'Aim for 7-9 hours to feel your best.' },
  { value: 2, emoji: '🥱', label: 'Fair', feedback: 'A little more rest could boost your energy.' },
  { value: 3, emoji: '😐', label: 'Okay', feedback: 'A solid night. Consistency is key!' },
  { value: 4, emoji: '😌', label: 'Good', feedback: 'Great job prioritizing rest!' },
  { value: 5, emoji: '🤩', label: 'Excellent', feedback: 'You\'re ready to conquer the day!' },
];
const energyOptions = [
  { value: 1, emoji: '🪫', label: 'Very Low', feedback: 'Your energy is up 5% from last week!' },
  { value: 2, emoji: '🔋', label: 'Low', feedback: 'Consistent sleep can help boost this.' },
  { value: 3, emoji: '⚡️', label: 'Good', feedback: 'Feeling energized! Let\'s do this.' },
  { value: 4, emoji: '🚀', label: 'High', feedback: 'Ready for anything!' },
];
const moodOptions = [
  { value: 1, emoji: '😩', label: 'Awful', feedback: 'It\'s okay to have off days. Be kind to yourself.' },
  { value: 2, emoji: '😕', label: 'Bad', feedback: 'A short walk can often lift your spirits.' },
  { value: 3, emoji: '😐', label: 'Okay', feedback: 'A neutral day is a good foundation to build on.' },
  { value: 4, emoji: '😊', label: 'Good', feedback: 'Glad to see you\'re feeling good today!' },
  { value: 5, emoji: '😁', label: 'Great!', feedback: 'Amazing! Let this positivity fuel your day.' },
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
        <CardTitle className="text-2xl font-bold text-gray-800">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <CheckInRow icon={<Moon className="text-indigo-500" />} label="Sleep Quality">
          <EmojiSlider options={sleepOptions} value={sleep} onChange={setSleep} />
        </CheckInRow>
        <CheckInRow icon={<BatteryFull className="text-green-500" />} label="Energy Level">
          <EmojiSlider options={energyOptions} value={energy} onChange={setEnergy} />
        </CheckInRow>
        <CheckInRow icon={<Smile className="text-yellow-500" />} label="Mood">
          <EmojiSlider options={moodOptions} value={mood} onChange={setMood} />
        </CheckInRow>
        <CheckInRow icon={<Droplets className="text-blue-500" />} label="Water Intake">
          <WaterTracker value={water} onChange={setWater} />
        </CheckInRow>
        
        <div className="pt-4">
            <Button onClick={handleLogCheckIn} className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6 font-bold">
              Log Today's Check-in
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Sub-components for a cleaner structure ---

const CheckInRow = ({ label, icon, children }) => (
  <div>
    <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
        {icon} {label}
    </Label>
    {children}
  </div>
);

const EmojiSlider = ({ options, value, onChange }) => {
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div>
      <div className="relative flex justify-between items-center px-2 h-12">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-1 bg-gray-200 rounded-full">
            <div 
                className="absolute h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${((value - 1) / (options.length - 1)) * 100}%` }}
            />
        </div>
        
        {/* Emoji Buttons */}
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="relative z-10 transition-transform duration-200 ease-out hover:scale-125"
          >
            <span className={cn("text-3xl transition-all duration-200", value === option.value ? 'opacity-100 scale-125' : 'opacity-50 grayscale hover:opacity-75')}>
              {option.emoji}
            </span>
          </button>
        ))}
      </div>
      {/* Dynamic Feedback Label */}
      <p className="text-center text-sm font-semibold text-gray-600 mt-2 h-5">
        {selectedOption.label} - <span className="text-gray-500 font-normal italic">{selectedOption.feedback}</span>
      </p>
    </div>
  );
};

const WaterTracker = ({ value, onChange }) => {
  const glasses = Array.from({ length: 8 }, (_, i) => i < value);
  const recommendation = "Aim for at least 8 glasses (2.5 liters) a day.";

  return (
    <div>
        <div className="flex flex-wrap gap-2">
        {glasses.map((isFilled, i) => (
            <button
            key={i}
            onClick={() => onChange(i + 1 === value ? i : i + 1)} // Allows deselecting the last one
            className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110",
                isFilled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            )}
            >
            <Droplets size={16} />
            </button>
        ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">{recommendation}</p>
    </div>
  );
};

export default DailyCheckIn;
