import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Send, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const isCoach = m.author === 'coach';
  const maxWidth = isMobile ? 'max-w-[85%]' : 'max-w-[80%]';
  const padding = isMobile ? 'p-3' : 'p-2';
  const classes = isCoach
    ? `bg-primary/10 text-primary-700 self-end rounded-xl ${padding} ${maxWidth}`
    : `bg-muted/20 text-foreground self-start rounded-xl ${padding} ${maxWidth}`;
  
  return (
    <div className={`flex ${isCoach ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={classes}>
        <div className={`text-sm ${isMobile ? 'leading-relaxed' : ''}`}>{m.content}</div>
        <div className={`text-xs text-muted-foreground mt-1 text-right ${isMobile ? 'mt-2' : ''}`}>
          {isMobile ? new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : formatDate(m.date)}
        </div>
      </div>
    </div>
  );
};

const ThreadListItem: React.FC<{
  thread: Thread;
  onSelect: (id: number) => void;
  active?: boolean;
}> = ({ thread, onSelect, active }) => {
  const isMobile = useIsMobile();
  const isClientResponded = thread.messages.some((m) => m.author === 'client');

  return (
    <motion.div
      onClick={() => onSelect(thread.id)}
      className={`cursor-pointer border rounded-xl transition-all duration-200 touch-manipulation ${
        isMobile ? 'p-4 active:scale-98 active:bg-muted/50' : 'p-3 hover:shadow-md'
      } ${active ? 'ring-2 ring-primary/30 bg-primary/5' : 'bg-card'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isMobile ? {} : { scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant={thread.type === 'check-in' ? 'secondary' : 'default'}
              className={isMobile ? 'text-xs px-2 py-1' : ''}
            >
              {thread.type}
            </Badge>
            {!isMobile && (
              <Badge className={`text-xs ${isClientResponded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {isClientResponded ? 'Responded' : 'Pending'}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <div className={`font-semibold ${isMobile ? 'text-base mb-2 line-clamp-2' : 'text-sm mb-2 truncate'}`}>
            {thread.title}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {isMobile 
                  ? new Date(thread.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                  : new Date(thread.createdAt).toLocaleDateString()
                }
              </span>
            </div>
            {isMobile && (
              <Badge className={`text-xs ${isClientResponded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {isClientResponded ? '✓' : '●'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CommunicationTab: React.FC<CommunicationTabProps> = () => {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showThreadList, setShowThreadList] = useState(true);

  const handleThreadSelect = (id: number) => {
    setActiveThreadId(id);
    setShowThreadList(false); // Hide the list on mobile
  };

  const handleBack = () => {
    setShowThreadList(true); // Show the list on mobile
    setActiveThreadId(null);
  };

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
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeThread, replyText, threads]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && replyText.trim()) {
      e.preventDefault();
      handleReply();
    }
  }, [handleReply, replyText]);

  // Auto-resize textarea on mobile
  useEffect(() => {
    if (textareaRef.current && isMobile) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [replyText, isMobile]);

  return (
    <div className="flex flex-col h-[calc(100dvh-var(--header-height,64px))] lg:h-auto lg:grid lg:grid-cols-3 lg:gap-4 overflow-hidden">
      {/* Unified Feed */}
      <Card 
        className={`flex-1 overflow-hidden flex flex-col ${!showThreadList ? 'hidden' : ''} lg:flex lg:col-span-1`}
      >
        <CardHeader className={isMobile ? 'pb-3' : ''}>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
            <MessageSquare className="h-5 w-5" /> Conversation Feed
          </CardTitle>
        </CardHeader>
        <CardContent className={`overflow-y-auto flex-1 ${isMobile ? 'px-3 pb-3 space-y-2' : 'space-y-3 p-4'}`}>
          {threads.map((t) => (
            <ThreadListItem key={t.id} thread={t} onSelect={handleThreadSelect} active={activeThreadId === t.id} />
          ))}
        </CardContent>
      </Card>

      {/* Active Thread */}
      <Card 
        className={`flex-1 overflow-hidden flex flex-col ${showThreadList ? 'hidden' : ''} lg:flex lg:col-span-2`}
      >
        <CardHeader className={`flex flex-row items-center ${isMobile ? 'pb-3 px-3' : ''}`}>
          <Button
            variant="ghost"
            size={isMobile ? "default" : "icon"}
            onClick={handleBack}
            className={`lg:hidden touch-manipulation ${isMobile ? 'px-3' : ''}`}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" />
            {isMobile && <span className="ml-2">Back</span>}
          </Button>
          <CardTitle className={`flex-1 ${isMobile ? 'text-base px-3' : 'text-center lg:text-left'}`}>
            {activeThread ? activeThread.title : 'Select a conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent className={`flex flex-col flex-1 ${isMobile ? 'px-3 pb-3' : 'p-4'}`}>
          {!activeThread ? (
            <div className={`text-muted-foreground text-center py-10 ${isMobile ? 'text-base' : 'text-sm'}`}>
              Select a conversation from the feed to view its details and respond.
            </div>
          ) : (
            <>
              <div className={`flex-1 flex flex-col overflow-y-auto border rounded-lg ${isMobile ? 'p-3' : 'p-2'}`}>
                {activeThread.messages.map((m) => (
                  <MessageBubble key={m.id} m={m} />
                ))}
              </div>
              {activeThread.respondable && (
                <div className={`flex gap-2 items-end ${isMobile ? 'mt-3 p-2 bg-muted/20 rounded-lg' : 'mt-4'}`}>
                  <Textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write a reply..."
                    className={`flex-1 resize-none touch-manipulation ${
                      isMobile 
                        ? 'min-h-[44px] max-h-[120px] border-0 bg-background focus-visible:ring-1' 
                        : 'min-h-[50px]'
                    }`}
                  />
                  <Button 
                    onClick={handleReply} 
                    disabled={!replyText.trim()} 
                    className={`shrink-0 touch-manipulation ${isMobile ? 'px-4 h-11' : ''}`}
                  >
                    <Send className="h-4 w-4" />
                    {!isMobile && <span className="ml-2">Reply</span>}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationTab;
