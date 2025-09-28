// src/components/customer/mycoach/ModernCoachDashboard.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Star, Calendar, X } from 'lucide-react';
import { coachInfo, dailyMessage } from '@/mockdata/mycoach/coachData';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernCoachDashboardProps {
    onViewBio: () => void;
}

const ModernCoachDashboard: React.FC<ModernCoachDashboardProps> = ({ onViewBio }) => {
    const [isDailyMessageVisible, setIsDailyMessageVisible] = useState(true);

    const handleDismissMessage = () => {
        setIsDailyMessageVisible(false);
    };

    return (
        <div className="space-y-6">
            {/* Modern Hero Coach Header */}
            <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="relative">
                                <Avatar className="w-20 h-20 ring-4 ring-primary/20 shadow-lg">
                                    <AvatarImage src={coachInfo.profileImageUrl} alt={coachInfo.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl">
                                        <User className="w-10 h-10" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background" />
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-1">{coachInfo.name}</h2>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium">Your Personal Coach</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {coachInfo.specialties.map((specialty, index) => (
                                        <Badge 
                                            key={index} 
                                            variant="secondary" 
                                            className="text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                        >
                                            {specialty}
                                        </Badge>
                                    ))}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={onViewBio}
                                        className="hover:bg-primary/5 transition-colors"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        View Full Bio
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Session
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Message with Enhanced Design */}
            <AnimatePresence>
                {isDailyMessageVisible && (
                    <motion.div
                        key="todays-message"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 300, transition: { duration: 0.3 } }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(event, info) => {
                            if (Math.abs(info.point.x) > 50) {
                                handleDismissMessage();
                            }
                        }}
                        className="relative cursor-grab active:cursor-grabbing"
                    >
                        <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-r from-accent/5 to-secondary/5 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                                <span className="text-lg">💬</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{dailyMessage.title}</h3>
                                                <p className="text-xs text-muted-foreground">Today's motivation</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {dailyMessage.content}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            'ml-4 opacity-60 hover:opacity-100 transition-opacity',
                                            'hidden sm:flex'
                                        )}
                                        onClick={handleDismissMessage}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModernCoachDashboard;