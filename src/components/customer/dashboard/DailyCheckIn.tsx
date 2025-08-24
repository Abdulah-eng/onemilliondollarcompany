// src/components/customer/dashboard/DailyCheckIn.tsx
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Droplets, BatteryFull, Smile, Moon } from 'lucide-react';

/*
TODO: Backend Integration Notes for DailyCheckIn
- isAlreadyCheckedIn: Query `daily_logs` for a record with the current user's ID and today's date.
- handleLogCheckIn: On button click, INSERT a new row into `daily_logs` with the selected values.
*/
const mockData = {
  isAlreadyCheckedIn: false,
};

const sleepOptions = [ { value: 1, emoji: '😴' }, { value: 2, emoji: '🥱' }, { value: 3, emoji: '😐' }, { value: 4, emoji: '😌' }, { value: 5, emoji: '🤩' }];
const energyOptions = [ { value: 1, emoji: '🪫' }, { value: 2, emoji: '🔋' }, { value: 3, emoji: '⚡️' }, { value: 4, emoji: '🚀' }];
const moodOptions = [ { value: 1, emoji: '😩' }, { value: 2, emoji: '😕' }, { value: 3, emoji: '😐' }, { value: 4, emoji: '😊' }, { value: 5, emoji: '😁' }];

const DailyCheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(mockData.isAlreadyCheckedIn);
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [mood, setMood] = useState(0);

  // State and refs for the scrolling carousel
  const [activeStep, setActiveStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Auto-scroll logic
    if (itemRefs.current[activeStep]) {
      itemRefs.current[activeStep]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [activeStep]);

  const handleLogCheckIn = () => {
    console.log({ water, sleep, energy, mood });
    setCheckedIn(true);
  };
  
  const isComplete = water > 0 && sleep > 0 && energy > 0 && mood > 0;

  if (checkedIn) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
        <CardContent className="p-6 text-center flex flex-col items-center gap-2">
          <Check className="w-10 h-10 bg-white/20 text-white rounded-full p-2"/>
          <h3 className="text-xl font-bold">Thanks for checking in today!</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg animate-fade-in-up overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 text-center">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* On mobile, this is a horizontal scroller. On desktop, it's a grid. */}
        <div
          ref={scrollContainerRef}
          className="flex lg:grid lg:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory p-1 -m-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div ref={el => itemRefs.current[0] = el} className="min-w-full flex-shrink-0 snap-start lg:min-w-0">
            <WaterModule value={water} onChange={(val) => { setWater(val); setTimeout(() => setActiveStep(1), 200); }} />
          </div>
          <div ref={el => itemRefs.current[1] = el} className="min-w-full flex-shrink-0 snap-start lg:min-w-0">
            <SleepModule value={sleep} onChange={(val) => { setSleep(val); setTimeout(() => setActiveStep(2), 200); }} />
          </div>
          <div ref={el => itemRefs.current[2] = el} className="min-w-full flex-shrink-0 snap-start lg:min-w-0">
            <EnergyModule value={energy} onChange={(val) => { setEnergy(val); setTimeout(() => setActiveStep(3), 200); }} />
          </div>
          <div ref={el => itemRefs.current[3] = el} className="min-w-full flex-shrink-0 snap-start lg:min-w-0">
            <MoodModule value={mood} onChange={(val) => { setMood(val); }} />
          </div>
        </div>

        {/* Progress Dots for mobile/tablet view */}
        <div className="flex lg:hidden justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <button key={i} onClick={() => setActiveStep(i)} className={cn("w-2 h-2 rounded-full transition-all", activeStep === i ? 'bg-orange-500 scale-125' : 'bg-gray-300')}/>
          ))}
        </div>
        
        <div className="pt-2">
            <Button onClick={handleLogCheckIn} disabled={!isComplete} size="lg" className="w-full bg-orange-500 hover:bg-orange-600 font-bold disabled:bg-gray-300">
              {isComplete ? "Log Today's Check-in" : "Complete All Items"}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Modular Check-in Components ---

const WaterModule = ({ value, onChange }) => (
  <CheckInModule icon={<Droplets className="text-blue-500" />} title="Water Intake">
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110", i < value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400')}>
          <Droplets size={16} />
        </button>
      ))}
    </div>
  </CheckInModule>
);

const SleepModule = ({ value, onChange }) => (
  <CheckInModule icon={<Moon className="text-indigo-500" />} title="Sleep Quality">
    <EmojiSelector options={sleepOptions} value={value} onChange={onChange} />
  </CheckInModule>
);

const EnergyModule = ({ value, onChange }) => (
  <CheckInModule icon={<BatteryFull className="text-green-500" />} title="Energy Level">
    <EmojiSelector options={energyOptions} value={value} onChange={onChange} />
  </CheckInModule>
);

const MoodModule = ({ value, onChange }) => (
  <CheckInModule icon={<Smile className="text-yellow-500" />} title="Mood">
    <EmojiSelector options={moodOptions} value={value} onChange={onChange} />
  </CheckInModule>
);

// --- Reusable Building Blocks ---

const CheckInModule = ({ icon, title, children }) => (
  <Card className="bg-slate-50 border-slate-200 h-full">
    <CardHeader className="pb-4">
      <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
        {icon} {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const EmojiSelector = ({ options, value, onChange }) => (
  <div className="flex justify-between items-center pt-2">
    {options.map((option) => (
      <button key={option.value} onClick={() => onChange(option.value)} className="transition-transform duration-200 ease-out hover:scale-125">
        <span className={cn("text-4xl transition-all duration-200", value === option.value ? 'opacity-100 scale-110' : 'opacity-40 grayscale hover:opacity-75')}>
          {option.emoji}
        </span>
      </button>
    ))}
  </div>
);

export default DailyCheckIn;
