// src/pages/coach/ClientDetailsPage.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Weight, Heart, Ruler, Calendar, Target,
  Dumbbell, Utensils, MessageCircle, BarChart,
  User, ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Mock data representing a detailed client profile
const mockClientData = {
  id: 'client_123',
  name: 'Jessica Lee',
  plan: 'Premium',
  status: 'On Track',
  color: 'bg-green-500',
  profilePicture: 'https://i.pravatar.cc/150?u=jessica-lee',
  personalInfo: {
    age: 32,
    gender: 'Female',
    height: '170 cm',
    weight: '65 kg',
  },
  goals: ['Fat Reduce', 'Increased Energy'],
  insights: {
    programProgress: '75%',
    avgDailyCheckIn: '95%',
    adherence: '92%',
    nextFollowUp: 'Sep 25',
  },
  stats: {
    caloriesBurned: '2100 kcal',
    macros: 'P: 120g, C: 200g, F: 55g',
    minutesMeditated: '30 min',
  },
};

// Reusable component for displaying a single stat item
const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="flex-shrink-0">
      <Icon size={20} className="text-muted-foreground" />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  </div>
);

const ClientDetailsPage = () => {
  const location = useLocation();
  // We'll use location.state to get the client data, falling back to mock data if it's not present
  const client = location.state?.client || mockClientData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-primary shadow-lg">
            <img className="aspect-square h-full w-full" src={client.profilePicture} alt={client.name} />
          </span>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-sm font-semibold text-muted-foreground">{client.plan} Plan</p>
          </div>
          <span className={cn("px-3 py-1 text-xs font-semibold rounded-full text-white mt-auto md:mt-0", client.color)}>
            {client.status}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto">
            <MessageCircle size={18} className="mr-2" />
            Respond to Feedback
          </Button>
          <Button className="w-full md:w-auto">
            <ClipboardCheck size={18} className="mr-2" />
            Check-in
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Progress & Insights 📈</h3>
                  <Button variant="ghost" className="text-primary">View All</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <p className="text-sm font-semibold text-muted-foreground">Program Progress</p>
                    <p className="text-2xl font-bold">{client.insights.programProgress}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <p className="text-sm font-semibold text-muted-foreground">Avg. Check-in</p>
                    <p className="text-2xl font-bold">{client.insights.avgDailyCheckIn}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <p className="text-sm font-semibold text-muted-foreground">Adherence</p>
                    <p className="text-2xl font-bold">{client.insights.adherence}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <p className="text-sm font-semibold text-muted-foreground">Next Follow-up</p>
                    <p className="text-sm font-bold mt-2">{client.insights.nextFollowUp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Current Program 🏋️</h3>
                  <Button variant="ghost" className="text-primary">View Details</Button>
                </div>
                {/* Placeholder for Program Detail/Calendar View */}
                <div className="bg-muted h-64 rounded-xl flex items-center justify-center text-muted-foreground">
                  [Program Calendar/Progress Graph goes here]
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">Client Details <User size={20} className="text-primary" /></h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatItem icon={Calendar} label="Age" value={client.personalInfo.age} />
                  <StatItem icon={Ruler} label="Height" value={client.personalInfo.height} />
                  <StatItem icon={Weight} label="Weight" value={client.personalInfo.weight} />
                  <StatItem icon={Heart} label="Gender" value={client.personalInfo.gender} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="shadow-lg rounded-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">Actionable Insights <BarChart size={20} className="text-primary" /></h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame size={20} className="text-orange-500" />
                      <p className="font-semibold">Calories Burned</p>
                    </div>
                    <p className="font-bold">{client.stats.caloriesBurned}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils size={20} className="text-teal-500" />
                      <p className="font-semibold">Macros</p>
                    </div>
                    <p className="font-bold">{client.stats.macros}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dumbbell size={20} className="text-indigo-500" />
                      <p className="font-semibold">Minutes Meditated</p>
                    </div>
                    <p className="font-bold">{client.stats.minutesMeditated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;
