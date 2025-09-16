import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Send,
  MessageSquare,
  StickyNote,
  Clock,
  AlertCircle,
  CheckCircle,
  Trash2,
  Tag,
} from 'lucide-react';

type NoteStatus = 'Open' | 'InReview' | 'Resolved';

interface Note {
  id: number;
  content: string;
  date: string;
  status: NoteStatus;
  internal?: boolean;
}

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

const StatusBadge: React.FC<{ status: NoteStatus }> = ({ status }) => {
  if (status === 'Resolved')
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        <CheckCircle className="h-3 w-3 mr-1 inline" />
        Resolved
      </Badge>
    );
  if (status === 'InReview')
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
        <Tag className="h-3 w-3 mr-1 inline" />
        In review
      </Badge>
    );
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
      <AlertCircle className="h-3 w-3 mr-1 inline" />
      Open
    </Badge>
  );
};

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
  return (
    <div
      onClick={() => onSelect(thread.id)}
      className={`cursor-pointer border rounded-xl p-3 hover:shadow-md ${
        active ? 'ring-2 ring-primary/30 bg-primary/5' : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge>{thread.type}</Badge>
            <div className="text-sm font-semibold">{thread.title}</div>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {latest ? `${latest.author}: ${latest.content}` : 'Ingen meldinger enda'}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(thread.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const NoteItem: React.FC<{
  note: Note;
  onChangeStatus: (id: number, status: NoteStatus) => void;
  onDelete: (id: number) => void;
}> = ({ note, onChangeStatus, onDelete }) => (
  <div className={`border rounded-xl p-4 ${note.status === 'Resolved' ? 'bg-emerald-50/60' : 'bg-card'}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm mb-2">{note.content}</p>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{note.date}</span>
          <StatusBadge status={note.status} />
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        {note.status !== 'Resolved' && (
          <Button size="sm" variant="ghost" onClick={() =>
            onChangeStatus(note.id, note.status === 'Open' ? 'InReview' : 'Resolved')
          }>
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDelete(note.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

const CommunicationTab: React.FC<CommunicationTabProps> = ({ client }) => {
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
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'Klient nevnte manglende motivasjon', date: '2024-09-10', status: 'Open' },
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

  const handleChangeNoteStatus = (id: number, status: NoteStatus) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));

  const handleDeleteNote = (id: number) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const checkIns = useMemo(() => threads.filter((t) => t.type === 'check-in'), [threads]);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Threads + Check-ins */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Conversation Threads</CardTitle></CardHeader>
            <CardContent>
              {threads.map((t) => (
                <ThreadListItem key={t.id} thread={t} onSelect={setActiveThreadId} active={activeThreadId === t.id} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Check-ins</CardTitle></CardHeader>
            <CardContent>
              {checkIns.map((c) => {
                const clientResponded = c.messages.some((m) => m.author === 'client');
                return (
                  <div key={c.id} className="border rounded-xl p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{c.title}</div>
                        <div className="text-xs">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                      <Badge className={clientResponded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                        {clientResponded ? 'Client responded' : 'Awaiting reply'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: Active thread + Notes */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Thread</CardTitle></CardHeader>
            <CardContent>
              {!activeThread ? (
                <div className="text-sm text-muted-foreground">Velg en tråd</div>
              ) : (
                <>
                  <div className="flex flex-col gap-2 max-h-[360px] overflow-auto border p-2 rounded-lg">
                    {activeThread.messages.map((m) => <MessageBubble key={m.id} m={m} />)}
                  </div>
                  {activeThread.respondable && (
                    <div className="mt-2 flex gap-2">
                      <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Skriv svar..." />
                      <Button onClick={handleReply} disabled={!replyText.trim()}>
                        <Send className="h-4 w-4 mr-2" /> Reply
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Private Coach Notes</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notes.map((n) => (
                <NoteItem key={n.id} note={n} onChangeStatus={handleChangeNoteStatus} onDelete={handleDeleteNote} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunicationTab;
