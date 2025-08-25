// src/components/customer/dashboard/DailyCheckIn.tsx
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Droplets, BatteryFull, Smile, Moon, TrendingUp } from 'lucide-react';

/*
TODO: Backend Integration Notes for DailyCheckIn
- isAlreadyCheckedIn: Query `daily_logs` for a record with the current user's ID and today's date.
- handleLogCheckIn: On button click, INSERT a new row into `daily_logs` with the selected values.
- trends: The trend data needs to be calculated by comparing historical data from the `daily_logs` table.
*/
const mockData = {
  isAlreadyCheckedIn: false,
  trends: {
    energyTrend: 'up', // 'up', 'down', 'stable'
  }
};

const sleepOptions = [
  { value: 1, emoji: '😴', label: '< 5 hrs', feedback: 'Tip: Try to avoid screens 30 minutes before bed.' },
  { value: 2, emoji: '🥱', label: '5-6 hrs', feedback: 'A little more rest could boost your energy.' },
  { value: 3, emoji: '😐', label: '6-7 hrs', feedback: 'A solid night. Consistency is key!' },
  { value: 4, emoji: '😌', label: '7-9 hrs', feedback: 'Great job prioritizing rest!' },
  { value: 5, emoji: '🤩', label: '9+ hrs', feedback: 'Excellent! You\'re set up for a peak performance day.' },
];
const energyOptions = [
  { value: 1, emoji: '🪫', feedback: 'Trend: Up 5% from last week! Keep it up.' },
  { value: 2, emoji: '🔋', feedback: 'Tip: A short walk can often boost energy levels.' },
  { value: 3, emoji: '⚡️', feedback: 'Benefit: High energy improves focus and workout quality.' },
  { value: 4, emoji: '🚀', feedback: 'Amazing! You\'re ready to crush your goals today.' },
];
const moodOptions = [
  { value: 1, emoji: '😩', feedback: 'It\'s okay to have off days. Be kind to yourself.' },
  { value: 2, emoji: '😕', feedback: 'Tip: A few minutes of mindfulness can help reset your day.' },
  { value: 3, emoji: '😐', feedback: 'A neutral mood is a great foundation to build on.' },
  { value: 4, emoji: '😊', feedback: 'Benefit: A positive mood is linked to better health outcomes.' },
  { value: 5, emoji: '😁', feedback: 'Awesome! Let this positivity fuel your day.' },
];

const DailyCheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(mockData.isAlreadyCheckedIn);
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [mood, setMood] = useState(0);

  const [activeStep, setActiveStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to active step
  useEffect(() => {
    if (itemRefs.current[activeStep]) {
      itemRefs.current[activeStep]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeStep]);

  // FIX: Observer to update active step on manual scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActiveStep(index);
            }
          }
        });
      },
      { root: scrollContainerRef.current, threshold: 0.6 }
    );

    itemRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleLogCheckIn = () => {
    console.log({ water, sleep, energy, mood });
    setCheckedIn(true);
  };
  
  const isComplete = water > 0 && sleep > 0 && energy > 0 && mood > 0;

  if (checkedIn) {
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Daily Check-in</h2>
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
          <CardContent className="p-6 text-center flex flex-col items-center gap-2">
            <Check className="w-10 h-10 bg-white/20 text-white rounded-full p-2"/>
            <h3 className="text-xl font-bold">Thanks for checking in today!</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Daily Check-in</h2>
      <div className="space-y-4">
        <div
          ref={scrollContainerRef}
          className="flex lg:grid lg:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory p-2 -m-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div ref={el => itemRefs.current[0] = el} className="min-w-full flex-shrink-0 snap-center lg:min-w-0 p-1">
            <WaterModule value={water} onChange={(val) => { setWater(val); setTimeout(() => setActiveStep(1), 1000); }} />
          </div>
          <div ref={el => itemRefs.current[1] = el} className="min-w-full flex-shrink-0 snap-center lg:min-w-0 p-1">
            <SleepModule value={sleep} onChange={(val) => { setSleep(val); setTimeout(() => setActiveStep(2), 1000); }} />
          </div>
          <div ref={el => itemRefs.current[2] = el} className="min-w-full flex-shrink-0 snap-center lg:min-w-0 p-1">
            <EnergyModule value={energy} onChange={(val) => { setEnergy(val); setTimeout(() => setActiveStep(3), 1000); }} trend={mockData.trends.energyTrend} />
          </div>
          <div ref={el => itemRefs.current[3] = el} className="min-w-full flex-shrink-0 snap-center lg:min-w-0 p-1">
            <MoodModule value={mood} onChange={setMood} />
          </div>
        </div>

        <div className="flex lg:hidden justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <button key={i} onClick={() => setActiveStep(i)} className={cn("w-2 h-2 rounded-full transition-all", activeStep === i ? 'bg-orange-500 scale-125' : 'bg-gray-300')}/>
          ))}
        </div>
        
        <div className="pt-2 flex justify-center">
            <Button onClick={handleLogCheckIn} disabled={!isComplete} size="lg" className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 font-bold disabled:bg-gray-300">
              {isComplete ? "Log Today's Check-in" : "Complete All Items"}
            </Button>
        </div>
      </div>
    </div>
  );
};

// --- Modular Check-in Components ---

const WaterModule = ({ value, onChange }) => {
    const totalLiters = (value * 0.3).toFixed(1);
    const feedback = value === 0 ? "Tap to log your water intake." : value < 8 ? `Current: ${totalLiters}L / Goal: 2.5L` : "Goal Reached! Great job hydrating.";
    return (
        <CheckInModule icon={<Droplets className="text-blue-500" />} title="Water Intake" feedback={feedback}>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-[280px] mx-auto">
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
  <CheckInModule icon={<Moon className="text-indigo-500" />} title="Sleep Quality" feedback={value > 0 ? sleepOptions[value - 1].feedback : "How well did you sleep last night?"}>
    <EmojiSlider options={sleepOptions} value={value} onChange={onChange} showLabels={true} />
  </CheckInModule>
);

const EnergyModule = ({ value, onChange, trend }) => {
    const trendIcon = trend === 'up' ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : null;
    const trendText = trend === 'up' ? 'Improving' : '';
    return (
        <CheckInModule icon={<BatteryFull className="text-green-500" />} title="Energy Level" feedback={value > 0 ? energyOptions[value - 1].feedback : "Rate your energy level."} trend={{icon: trendIcon, text: trendText}}>
            <EmojiSlider options={energyOptions} value={value} onChange={onChange} />
        </CheckInModule>
    );
};

const MoodModule = ({ value, onChange }) => (
  <CheckInModule icon={<Smile className="text-yellow-500" />} title="Mood" feedback={value > 0 ? moodOptions[value - 1].feedback : "How are you feeling right now?"}>
    <EmojiSlider options={moodOptions} value={value} onChange={onChange} />
  </CheckInModule>
);

// --- Reusable Building Blocks ---

const CheckInModule = ({ icon, title, feedback, trend, children }) => (
  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
        {icon} {title}
        {trend?.text && <span className="ml-auto flex items-center gap-1 text-xs font-medium text-slate-500">{trend.icon} {trend.text}</span>}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col justify-center p-4">
        {children}
        <FeedbackMessage text={feedback} />
    </CardContent>
  </Card>
);

const EmojiSlider = ({ options, value, onChange, showLabels = false }) => (
  <div className="relative flex justify-between items-center pt-2 max-w-xs mx-auto w-full">
    {options.map((option) => (
      <div key={option.value} className="flex flex-col items-center gap-1">
        {showLabels && <span className="text-xs font-medium text-slate-500 h-4">{option.label}</span>}
        <button onClick={() => onChange(option.value)} className="transition-transform duration-200 ease-out hover:scale-125">
          <span className={cn("text-3xl transition-all duration-200", value === option.value ? 'opacity-100 scale-110' : 'opacity-40 grayscale hover:opacity-75')}>
            {option.emoji}
          </span>
        </button>
      </div>
    ))}
  </div>
);

const FeedbackMessage = ({ text }) => (
    <p key={text} className="text-xs text-slate-500 italic text-center mt-3 h-8 animate-fade-in">
        {text}
    </p>
);

export default DailyCheckIn;
