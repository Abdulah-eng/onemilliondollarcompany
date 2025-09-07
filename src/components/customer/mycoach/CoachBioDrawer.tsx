// src/components/customer/mycoach/CoachBioDrawer.tsx
import { Card, CardContent } from '@/components/ui/card';
import { coachInfo, coachStats, coachTrainings, coachPhotos } from '@/mockdata/mycoach/coachData';
import { CircleUserRound } from 'lucide-react';

const CoachBioDrawer = () => {
    return (
        <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Coach Header Section */}
            <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-full flex-shrink-0 bg-gray-200 overflow-hidden">
                    {coachInfo.profileImageUrl ? (
                        <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
                    ) : (
                        <CircleUserRound className="w-16 h-16 text-primary" />
                    )}
                </div>
                <div className="flex-1 space-y-1">
                    <h2 className="text-2xl font-bold">{coachInfo.name}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <span className="font-bold">1,208</span>&nbsp;followers
                        </div>
                        <div className="flex items-center">
                            <span className="font-bold">380</span>&nbsp;following
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span>{coachStats.level}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>{coachStats.hours}</span>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">Statistics</h3>
                    <span className="text-sm text-muted-foreground">Show all</span>
                </div>
                <Card className="shadow-lg border-none bg-orange-100/50">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="space-y-1 flex-shrink-0">
                                <p className="text-lg font-semibold">{coachStats.caloriesThisWeek}kcal</p>
                                <p className="text-sm font-medium text-muted-foreground">Calories</p>
                                <p className="text-sm font-medium text-muted-foreground">{coachStats.timeThisWeek}</p>
                                <p className="text-sm font-medium text-muted-foreground">Time</p>
                            </div>
                            <div className="flex flex-1 space-x-2 h-24 items-end">
                                {coachStats.weeklyData.map((value, index) => (
                                    <div
                                        key={index}
                                        style={{ height: `${value}%` }}
                                        className="w-4 bg-orange-500 rounded-md"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
                                <span key={index}>{day}</span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Trainings Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">Trainings</h3>
                    <span className="text-sm text-muted-foreground">Show all</span>
                </div>
                <div className="flex space-x-4 overflow-x-auto p-1">
                    {coachTrainings.map(training => (
                        <div key={training.id} className="flex-shrink-0 w-32">
                            <div className="relative w-full h-32 rounded-xl overflow-hidden">
                                <img src={training.image} alt={training.title} className="object-cover w-full h-full" />
                            </div>
                            <p className="mt-2 text-sm font-medium">{training.title}</p>
                            <p className="text-xs text-muted-foreground">{training.daysAgo} days ago</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Photos Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">Photos</h3>
                    <span className="text-sm text-muted-foreground">Show all</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {coachPhotos.map(photo => (
                        <div key={photo.id} className="w-full h-28 rounded-xl overflow-hidden">
                            <img src={photo.url} alt="Coach's activity photo" className="object-cover w-full h-full" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CoachBioDrawer;
