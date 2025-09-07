// src/components/customer/mycoach/CoachMessageCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory, chatMessages } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { MessageSquare, Pin, BarChart2, SendHorizonal, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CoachMessageCard = () => {
  const isPremiumUser = true; // TODO: Fetch from user_roles or plans table
  const [response, setResponse] = useState('');

  if (!isPremiumUser) {
    return (
      <Card className="shadow-lg border-none animate-fade-in p-6 text-center">
        <h3 className="text-xl font-bold">Connect with Your Coach</h3>
        <p className="mt-2 text-muted-foreground">Upgrade to a **Premium Plan** for direct feedback and chat access! 🚀</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-none animate-fade-in flex flex-col h-[600px] md:h-full">
      <Tabs defaultValue="feedback" className="w-full h-full flex flex-col">
        <CardHeader className="p-4 border-b">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value="feedback" className="flex-1 overflow-y-auto p-4 space-y-4">
          {feedbackHistory.length > 0 ? (
            <div className="space-y-4">
              {feedbackHistory.map(feedback => (
                <div key={feedback.id} className="space-y-2 p-4 border rounded-xl bg-secondary/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {feedback.type === 'Program Feedback' && <MessageSquare className="w-5 h-5 text-purple-500" />}
                      {feedback.type === 'Check-in' && <Pin className="w-5 h-5 text-orange-500" />}
                      {feedback.type === 'Program Enhancement' && <BarChart2 className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{feedback.title}</h4>
                        <span className="text-xs text-muted-foreground">{feedback.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{feedback.message}</p>
                      <Textarea 
                        placeholder="Type your response here..." 
                        value={response} 
                        onChange={(e) => setResponse(e.target.value)} 
                        className="mt-2 text-sm" 
                      />
                      <Button size="sm" className="mt-2">Send Response</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <CheckCircle2 size={48} className="mb-4 text-primary" />
              <p>No recent feedback. You're on track!</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="chat" className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-xl ${msg.sender === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-foreground'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex space-x-2">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button>
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CoachMessageCard;
