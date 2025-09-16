import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Send, Clock, MessageSquare } from 'lucide-react';

interface Message {
  id: number;
  author: 'coach' | 'client' | 'system';
  content: string;
  date: string;
}

interface Thread {
  id: number;
  title: string;
  type: 'check-in' | 'feedback' | 'message';
  createdAt: string;
  respondable: boolean;
  messages: Message[];
  archived?: boolean;
}

interface CommunicationTabProps {
  client: any;
}

const formatDate = (iso: string) => new Date(iso).toLocaleString();

const MessageBubble: React.FC<{ m: Message }> = ({ m }) => {
  const isCoach = m.author === 'coach';
  const classes = isCoach
    ? 'bg-primary/10 text-primary-700 self-end rounded-xl p-2 max-w-[80%]'
    : 'bg-muted/20 text-foreground self-start rounded-xl p-2 max-w-[80%]';
  return (
    <div className={`flex ${isCoach ? 'justify-end' : 'justify-start'}`}>
      <div className={classes}>
        <div className="text-sm">{m.content}</div>
        <div className="text-xs text-muted-foreground mt-1 text-right">{formatDate(m.date)}</div>
      </div>
    </div>
  );
};

const ThreadListItem: React.FC<{
  thread: Thread;
  onSelect: (id: number) => void;
  active?: boolean;
}> = ({ thread, onSelect, active }) => {
  const latest = thread.messages.at(-1);
  const isClientResponded = thread.messages.some((m) => m.author === 'client');

  return (
    <motion.div
      onClick={() => onSelect(thread.id)}
      className={`cursor-pointer border rounded-xl p-3 hover:shadow-md transition-shadow ${
        active ? 'ring-2 ring-primary/30 bg-primary/5' : 'bg-card'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={thread.type === 'check-in' ? 'secondary' : 'default'}>{thread.type}</Badge>
            <div className="text-sm font-semibold truncate">{thread.title}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            <div className="ml-auto">
              <Badge className={isClientResponded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                {isClientResponded ? 'Client Responded' : 'Awaiting Reply'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CommunicationTab: React.FC<CommunicationTabProps> = () => {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 1,
      title: 'Weekly check-in: energy + workouts',
      type: 'check-in',
      createdAt: '2024-09-10T09:00:00Z',
      respondable: true,
      messages: [
        { id: 101, author: 'coach', content: 'Hvordan føles treningen?', date: '2024-09-10T09:00:00Z' },
        { id: 102, author: 'client', content: 'Bra! Litt sliten på onsdag.', date: '2024-09-10T14:22:00Z' },
      ],
    },
    {
      id: 2,
      title: 'Feedback on meal plan',
      type: 'feedback',
      createdAt: '2024-09-08T11:30:00Z',
      respondable: true,
      messages: [
        { id: 201, author: 'client', content: 'The new meal plan is great. The smoothie recipes are a lifesaver!', date: '2024-09-08T11:30:00Z' },
        { id: 202, author: 'coach', content: 'Glad to hear it! Let me know if you have any questions.', date: '2024-09-08T15:00:00Z' },
      ],
    },
    {
      id: 3,
      title: 'Quick question about macros',
      type: 'message',
      createdAt: '2024-09-07T10:00:00Z',
      respondable: true,
      messages: [
        { id: 301, author: 'client', content: 'What are the recommended macros for a high-intensity workout day?', date: '2024-09-07T10:00:00Z' },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<number | null>(threads[0]?.id ?? null);
  const [replyText, setReplyText] = useState('');

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) ?? null,
    [threads, activeThreadId]
  );

  const handleReply = useCallback(() => {
    if (!activeThread || !replyText.trim()) return;
    const nextMsgId = Math.max(0, ...threads.flatMap((t) => t.messages.map((m) => m.id))) + 1;
    const msg: Message = { id: nextMsgId, author: 'coach', content: replyText, date: new Date().toISOString() };
    setThreads((prev) => prev.map((t) => (t.id === activeThread.id ? { ...t, messages: [...t.messages, msg] } : t)));
    setReplyText('');
  }, [activeThread, replyText, threads]);

  return (
    <motion.div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Left: Unified Feed */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Conversation Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[70vh] overflow-y-auto">
          {threads.map((t) => (
            <ThreadListItem key={t.id} thread={t} onSelect={setActiveThreadId} active={activeThreadId === t.id} />
          ))}
        </CardContent>
      </Card>

      {/* Right: Active Thread */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {activeThread ? activeThread.title : 'Select a conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activeThread ? (
            <div className="text-sm text-muted-foreground text-center py-10">
              Select a conversation from the feed to view its details and respond.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 max-h-[calc(70vh-120px)] overflow-y-auto border p-4 rounded-lg">
                {activeThread.messages.map((m) => (
                  <MessageBubble key={m.id} m={m} />
                ))}
              </div>
              {activeThread.respondable && (
                <div className="mt-4 flex gap-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1"
                  />
                  <Button onClick={handleReply} disabled={!replyText.trim()} className="shrink-0">
                    <Send className="h-4 w-4 mr-2" /> Reply
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommunicationTab;
