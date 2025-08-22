// src/components/customer/dashboard/DailyCheckIn.tsx
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Droplets, BatteryFull, Smile, Moon } from 'lucide-react';

const mockData = {
  isAlreadyCheckedIn: false,
};

const sleepOptions = [ { value: 1, emoji: '😴' }, { value: 2, emoji: '🥱' }, { value: 3, emoji: '😐' }, { value: 4, emoji: '😌' }, { value: 5, emoji: '🤩' }];
const energyOptions = [ { value: 1, emoji: '🪫' }, { value: 2, emoji: '🔋' }, { value: 3, emoji: '⚡️' }, { value: 4, emoji: '🚀' }];
const moodOptions = [ { value: 1, emoji: '😩' }, { value: 2, emoji: '😕' }, { value: 3, emoji: '😐' }, { value: 4, emoji: '😊' }, { value: 5, emoji: '😁' }];

const DailyCheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(mockData.isAlreadyCheckedIn);
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(4);

  const handleLogCheckIn = () => {
    console.log({ water, sleep, energy, mood });
    setCheckedIn(true);
  };

  const feedbackMessage = useMemo(() => {
    if (sleep >= 4) return "Great job prioritizing rest! Quality sleep is key.";
    if (energy >= 3) return "Feeling energized! Let's channel that into your day.";
    if (water >= 8) return "Excellent hydration! You're fueling your body for success.";
    if (mood >= 4) return "A positive mindset is your greatest asset. Keep it up!";
    return "Every check-in is a step forward. Stay consistent!";
  }, [sleep, energy, water, mood]);

  if (checkedIn) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
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
        <CardTitle className="text-xl font-bold text-gray-800">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CheckInRow icon={<Droplets className="text-blue-500" />} label="Water Intake">
          <WaterTracker value={water} onChange={setWater} />
        </CheckInRow>
        <CheckInRow icon={<Moon className="text-indigo-500" />} label="Sleep Quality">
          <EmojiSlider options={sleepOptions} value={sleep} onChange={setSleep} />
        </CheckInRow>
        <CheckInRow icon={<BatteryFull className="text-green-500" />} label="Energy Level">
          <EmojiSlider options={energyOptions} value={energy} onChange={setEnergy} />
        </CheckInRow>
        <CheckInRow icon={<Smile className="text-yellow-500" />} label="Mood">
          <EmojiSlider options={moodOptions} value={mood} onChange={setMood} />
        </CheckInRow>
        <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 italic mb-4">{feedbackMessage}</p>
            <Button onClick={handleLogCheckIn} className="w-full bg-orange-500 hover:bg-orange-600 font-bold">
              Log Today's Check-in
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CheckInRow = ({ label, icon, children }) => (
  <div>
    <Label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
        {icon} {label}
    </Label>
    {children}
  </div>
);

const EmojiSlider = ({ options, value, onChange }) => (
  <div className="flex justify-between items-center px-1">
    {options.map((option) => (
      <button key={option.value} onClick={() => onChange(option.value)} className="transition-transform duration-200 ease-out hover:scale-125">
        {/* --- SIZE ADJUSTMENT --- */}
        <span className={cn("text-3xl", value === option.value ? 'opacity-100' : 'opacity-40 grayscale group-hover:opacity-60')}>
          {option.emoji}
        </span>
      </button>
    ))}
  </div>
);

const WaterTracker = ({ value, onChange }) => {
  const glasses = Array.from({ length: 8 }, (_, i) => i < value);
  return (
    <div className="flex flex-wrap gap-2">
      {glasses.map((isFilled, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          // --- SIZE ADJUSTMENT ---
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110",
            isFilled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
          )}
        >
          <Droplets size={16} />
        </button>
      ))}
    </div>
  );
};

export default DailyCheckIn;
