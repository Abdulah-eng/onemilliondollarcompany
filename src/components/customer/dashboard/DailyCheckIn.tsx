// src/components/customer/dashboard/DailyCheckIn.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/*
TODO: Backend Integration Notes for DailyCheckIn
- `isAlreadyCheckedIn`: Before rendering, query the `daily_logs` table to see if a record for the current user and today's date already exists.
- `handleLogCheckIn`: On button click, this function should take the selected values (sleep, energy, mood, water) and INSERT a new row into the `daily_logs` table for the current user and date.
*/
const mockData = {
  isAlreadyCheckedIn: false,
};

const moodOptions = [
  { label: 'Awful', emoji: '😩' },
  { label: 'Bad', emoji: '😕' },
  { label: 'Okay', emoji: '😐' },
  { label: 'Good', emoji: '😊' },
  { label: 'Great', emoji: '😁' },
];

const DailyCheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(mockData.isAlreadyCheckedIn);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [selectedSleep, setSelectedSleep] = useState(null);

  const handleLogCheckIn = () => {
    // This is where you would send the data to Supabase
    console.log({
      mood: selectedMood,
      energy: selectedEnergy,
      sleep: selectedSleep,
    });
    setCheckedIn(true);
  };

  if (checkedIn) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold">Thanks for checking in today!</h3>
          <p className="opacity-90 mt-1">Your coach has been updated.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CheckInRow label="How was your sleep?">
          <EmojiSelector options={moodOptions} selected={selectedSleep} onSelect={setSelectedSleep} />
        </CheckInRow>
        <CheckInRow label="How is your energy?">
          <EmojiSelector options={moodOptions} selected={selectedEnergy} onSelect={setSelectedEnergy} />
        </CheckInRow>
        <CheckInRow label="What's your mood?">
          <EmojiSelector options={moodOptions} selected={selectedMood} onSelect={setSelectedMood} />
        </CheckInRow>
        <Button onClick={handleLogCheckIn} className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6">
          Log Today's Check-in
        </Button>
      </CardContent>
    </Card>
  );
};

const CheckInRow = ({ label, children }) => (
  <div>
    <p className="font-semibold text-gray-700 mb-3">{label}</p>
    {children}
  </div>
);

const EmojiSelector = ({ options, selected, onSelect }) => (
  <div className="flex justify-between items-center gap-2">
    {options.map(option => (
      <button
        key={option.label}
        onClick={() => onSelect(option.label)}
        className={cn(
          "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 transform hover:scale-110",
          selected === option.label ? 'bg-emerald-100' : 'hover:bg-gray-100'
        )}
      >
        <span className="text-3xl">{option.emoji}</span>
        <span className="text-xs font-medium text-gray-600">{option.label}</span>
      </button>
    ))}
  </div>
);

export default DailyCheckIn;
