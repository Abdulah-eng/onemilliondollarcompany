// src/components/customer/mycoach/ChatBox.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { chatMessages } from '@/mockdata/mycoach/coachData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

const ChatBox = () => {
    return (
        <Card className="shadow-lg border-none animate-fade-in flex flex-col h-[500px]">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Chat with your Coach</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </CardContent>
            <div className="p-4 border-t flex space-x-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button>
                    <SendHorizonal className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
};

export default ChatBox;
