// src/components/coach/clientCard/tabs/CustomerOverviewTab.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    Calendar, Ruler, Weight, User, Heart,
    Target, Utensils, Award, BarChart,
    MessageCircle, Zap, ClipboardCheck,
    Flame, Dumbbell
} from 'lucide-react';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';

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

const CustomerOverviewTab = ({ client = mockClientData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Insights and Progress (Re-using old ClientProgress) */}
                <Card className="shadow-lg rounded-xl bg-card">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="text-lg font-bold">Progress & Insights 📈</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                                <p className="text-sm font-semibold text-muted-foreground">Program Progress</p>
                                <p className="text-2xl font-bold">{client.insights?.programProgress || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                                <p className="text-sm font-semibold text-muted-foreground">Avg. Check-in</p>
                                <p className="text-2xl font-bold">{client.insights?.avgDailyCheckIn || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                                <p className="text-sm font-semibold text-muted-foreground">Adherence</p>
                                <p className="text-2xl font-bold">{client.insights?.adherence || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                                <p className="text-sm font-semibold text-muted-foreground">Next Follow-up</p>
                                <p className="text-sm font-bold mt-2">{client.insights?.nextFollowUp || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Placeholder for Detailed Graphs */}
                <div className="bg-muted h-96 rounded-xl shadow-lg flex items-center justify-center text-muted-foreground">
                    [Detailed Progress Graphs go here]
                </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
                {/* Personal Info */}
                <Card className="shadow-lg rounded-xl bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User size={20} className="text-primary" />
                            Personal Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <StatItem icon={Calendar} label="Age" value={client.personalInfo?.age || 'N/A'} />
                            <StatItem icon={Ruler} label="Height" value={client.personalInfo?.height ? `${client.personalInfo.height} cm` : 'N/A'} />
                            <StatItem icon={Weight} label="Weight" value={client.personalInfo?.weight ? `${client.personalInfo.weight} kg` : 'N/A'} />
                            <StatItem icon={Heart} label="Gender" value={client.personalInfo?.gender || 'N/A'} />
                        </div>
                    </CardContent>
                </Card>

                {/* Goals & Preferences */}
                <Card className="shadow-lg rounded-xl bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target size={20} className="text-primary" />
                            Goals & Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold text-muted-foreground">Goals</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {client.goals?.map((goal, index) => (
                                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                                        {goal}
                                    </Badge>
                                )) || <p className="text-sm text-muted-foreground">None</p>}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground">Preferred Program Type</p>
                            <p className="text-sm text-foreground mt-2">
                                {client.preferences?.preferredProgramType?.[0] || 'N/A'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Actionable Insights */}
                <Card className="shadow-lg rounded-xl bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart size={20} className="text-primary" />
                            Key Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Flame size={20} className="text-orange-500" />
                                <p className="font-semibold">Calories Burned</p>
                            </div>
                            <p className="font-bold">{client.stats?.caloriesBurned || 'N/A'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Utensils size={20} className="text-teal-500" />
                                <p className="font-semibold">Macros</p>
                            </div>
                            <p className="font-bold">{client.stats?.macros || 'N/A'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Dumbbell size={20} className="text-indigo-500" />
                                <p className="font-semibold">Minutes Meditated</p>
                            </div>
                            <p className="font-bold">{client.stats?.minutesMeditated || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CustomerOverviewTab;
