// src/components/customer/dashboard/TodaysProgram.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ShoppingBag } from "lucide-react";

const mockData = {
  day: "Monday",
  workout: {
    title: "Leg Day",
    exercises: [
      { name: "Squat", sets: "3x5" },
      { name: "Lunges", sets: "3x15" },
      { name: "Leg Press", sets: "3x10" },
    ],
    duration: "45 minutes",
    equipment: "Gym",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200",
  },
  nutrition: {
    title: "Lunch – Eggs Benedict",
    ingredients: ["Eggs", "Bread", "Avocado", "Spinach"],
    shoppingListAvailable: true,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
  },
  mental: {
    title: "Afternoon Meditation",
    duration: "15 minutes",
    time: "16:00",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
  },
};

const TodaysProgram = () => {
  const { day, workout, nutrition, mental } = mockData;

  return (
    <div className="w-full space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">
        {day} – Your Focus Today
      </h2>

      {/* Workout Highlight (Full Width) */}
      <Card className="relative overflow-hidden rounded-3xl shadow-sm border-0">
        <img
          src={workout.image}
          alt="Workout"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40" />
        <CardContent className="relative p-6 text-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">🏋️ {workout.title}</h3>
            <span className="text-sm flex items-center bg-white/20 rounded-full px-3 py-1">
              <Clock className="w-4 h-4 mr-1" /> {workout.duration}
            </span>
          </div>
          <p className="text-sm opacity-90">Equipment: {workout.equipment}</p>
          <ul className="space-y-1 text-sm">
            {workout.exercises.map((ex, i) => (
              <li key={i} className="flex justify-between">
                <span>{ex.name}</span>
                <span className="font-medium">{ex.sets}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white">
            Start Workout
          </Button>
        </CardContent>
      </Card>

      {/* Nutrition & Mental (2-column on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nutrition */}
        <Card className="relative overflow-hidden rounded-3xl shadow-sm border-0">
          <img
            src={nutrition.image}
            alt="Nutrition"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
          <CardContent className="relative p-6 space-y-3">
            <h3 className="text-xl font-semibold">🥗 {nutrition.title}</h3>
            <ul className="flex flex-wrap gap-2 text-sm text-slate-700">
              {nutrition.ingredients.map((item, i) => (
                <li
                  key={i}
                  className="px-3 py-1 bg-slate-100 rounded-full text-xs"
                >
                  {item}
                </li>
              ))}
            </ul>
            {nutrition.shoppingListAvailable && (
              <Button
                variant="outline"
                className="w-full rounded-xl mt-3 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Get Shopping List
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Mental */}
        <Card className="relative overflow-hidden rounded-3xl shadow-sm border-0">
          <img
            src={mental.image}
            alt="Meditation"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/30" />
          <CardContent className="relative p-6 text-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">🧘 {mental.title}</h3>
              <span className="text-sm flex items-center bg-white/20 rounded-full px-3 py-1">
                <Clock className="w-4 h-4 mr-1" /> {mental.duration}
              </span>
            </div>
            <p className="text-sm opacity-90">Scheduled: {mental.time}</p>
            <Button className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white">
              Start Meditation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TodaysProgram;
