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
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800", // example
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
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">
        {day} – Your Focus Today
      </h2>

      {/* Workout */}
      <Card className="overflow-hidden rounded-2xl shadow-sm border border-slate-100">
        <div className="h-40 w-full overflow-hidden">
          <img
            src={workout.image}
            alt="Workout"
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              🏋️ {workout.title}
            </h3>
            <span className="text-sm text-slate-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" /> {workout.duration}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Equipment: {workout.equipment}
          </p>
          <ul className="text-slate-700 text-sm space-y-1">
            {workout.exercises.map((ex, i) => (
              <li key={i} className="flex justify-between">
                <span>{ex.name}</span>
                <span className="font-medium">{ex.sets}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full rounded-xl mt-3">Start Workout</Button>
        </CardContent>
      </Card>

      {/* Nutrition */}
      <Card className="overflow-hidden rounded-2xl shadow-sm border border-slate-100">
        <div className="h-40 w-full overflow-hidden">
          <img
            src={nutrition.image}
            alt="Nutrition"
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-5 space-y-3">
          <h3 className="text-xl font-semibold">🥗 {nutrition.title}</h3>
          <ul className="flex flex-wrap gap-2 text-sm text-slate-600">
            {nutrition.ingredients.map((item, i) => (
              <li
                key={i}
                className="px-2 py-1 bg-slate-100 rounded-full text-xs"
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
      <Card className="overflow-hidden rounded-2xl shadow-sm border border-slate-100">
        <div className="h-40 w-full overflow-hidden">
          <img
            src={mental.image}
            alt="Meditation"
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              🧘 {mental.title}
            </h3>
            <span className="text-sm text-slate-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" /> {mental.duration}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Scheduled: {mental.time}
          </p>
          <Button className="w-full rounded-xl mt-3">Start Meditation</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodaysProgram;
