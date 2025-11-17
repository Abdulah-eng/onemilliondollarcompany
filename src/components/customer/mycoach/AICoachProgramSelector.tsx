// src/components/customer/mycoach/AICoachProgramSelector.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Dumbbell, Apple, Brain, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type ProgramType = 'fitness' | 'nutrition' | 'mental_health';

interface ProgramTypeOption {
  id: ProgramType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const programTypes: ProgramTypeOption[] = [
  {
    id: 'fitness',
    label: 'Fitness',
    description: 'Personalized workout plans and exercise routines',
    icon: <Dumbbell className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    description: 'Custom meal plans and dietary guidance',
    icon: <Apple className="w-6 h-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    id: 'mental_health',
    label: 'Mental Health',
    description: 'Mindfulness, meditation, and stress management',
    icon: <Brain className="w-6 h-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
];

interface AICoachProgramSelectorProps {
  onProgramGenerated?: (programId: string, category: string) => void;
}

const AICoachProgramSelector: React.FC<AICoachProgramSelectorProps> = ({ onProgramGenerated }) => {
  const { user, profile } = useAuth();
  const [selectedType, setSelectedType] = useState<ProgramType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateProgram = async () => {
    if (!selectedType || !user?.id) {
      toast.error('Please select a program type');
      return;
    }

    // Check if user has active plan or trial
    const hasActivePlan = profile?.plan && (
      profile.plan === 'trial' 
        ? (profile.plan_expiry ? new Date(profile.plan_expiry) > new Date() : false)
        : (profile.plan_expiry ? new Date(profile.plan_expiry) > new Date() : true)
    );

    if (!hasActivePlan) {
      toast.error('You need an active subscription or trial to generate AI programs');
      return;
    }

    setIsGenerating(true);

    try {
      // Call the AI generate plan edge function
      const { data, error } = await supabase.functions.invoke('ai-generate-plan', {
        body: { 
          userId: user.id,
          category: selectedType === 'mental_health' ? 'mental_health' : selectedType
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Save the generated program to the database
      if (data?.plan) {
        const { data: programData, error: insertError } = await supabase
          .from('programs')
          .insert({
            name: data.plan.summary || `${selectedType} Program`,
            description: `AI-generated ${selectedType} program`,
            status: 'active',
            category: selectedType,
            coach_id: user.id, // AI coach
            assigned_to: user.id,
            scheduled_date: new Date().toISOString(),
            plan: data.plan,
            is_ai_generated: true,
          })
          .select('id, category')
          .single();

        if (insertError) {
          throw insertError;
        }

        toast.success(`Your ${selectedType} program has been generated!`);
        
        if (onProgramGenerated && programData) {
          onProgramGenerated(programData.id, programData.category);
        }

        // Reset selection
        setSelectedType(null);
      }
    } catch (error: any) {
      console.error('Error generating program:', error);
      toast.error(error?.message || 'Failed to generate program. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>AI Coach Program Generator</CardTitle>
            <CardDescription>
              Select a program type and get a personalized AI-generated plan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Program Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {programTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedType === type.id
                    ? 'border-primary border-2 shadow-lg'
                    : 'border hover:border-primary/50'
                } ${type.bgColor}`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`mx-auto w-16 h-16 rounded-full ${type.bgColor} flex items-center justify-center ${type.color}`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{type.label}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                  {selectedType === type.id && (
                    <Badge className="bg-primary text-primary-foreground">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateProgram}
          disabled={!selectedType || isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Your Program...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Program
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {selectedType && (
          <p className="text-sm text-center text-muted-foreground">
            Your personalized {programTypes.find(t => t.id === selectedType)?.label.toLowerCase()} program will be created based on your goals and preferences.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachProgramSelector;

