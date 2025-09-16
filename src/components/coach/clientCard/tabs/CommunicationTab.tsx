import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  User,
  Plus,
  Tag,
  Edit3,
} from 'lucide-react';

/**
 * CommunicationTab forbedret:
 * - Tråder: vis, svar i samme tråd, slett tråd
 * - Interne notater: legg til, endre status (Open, InReview, Resolved), slett
 * - Check-ins og klientrespons: tydelig visning
 * - Ytelsesforbedringer: React.memo, useMemo, useCallback, lazy rendering av eldre meldinger
 * - Responsiv layout
 *
 * Si det som det er: koden er klar til å plugges inn der du tidligere hadde CommunicationTab.
 */

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
  date: string; // ISO or YYYY-MM-DD
}

interface Thread {
  id: number;
  title: string;
  type: 'check-in' | 'feedback' | 'message';
  createdAt: string;
  respondable: boolean;
  messages: Message[]; // ordered oldest -> newest
  // metadata
  archived?: boolean;
}

interface CommunicationTabProps {
  client: any;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

// Badge-komponent for note-status
const StatusBadge: React.FC<{ status: NoteStatus }> = React.memo(({ status }) => {
  if (status === 'Resolved')
    return (
      <Badge className="rounded-full px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
        <CheckCircle className="h-3 w-3 mr-1 inline" />
        Resolved
      </Badge>
    );
  if (status === 'InReview')
    return (
      <Badge className="rounded-full px-2 py-1 text-xs bg-orange-100 text-orange-700 border-orange-200">
        <Tag className="h-3 w-3 mr-1 inline" />
        In review
      </Badge>
    );
  return (
    <Badge className="rounded-full px-2 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200">
      <AlertCircle className="h-3 w-3 mr-1 inline" />
      Open
    </Badge>
  );
});
StatusBadge.displayName = 'StatusBadge';

// Minimal Message bubble (memoized)
const MessageBubble: React.FC<{ m: Message }> = React.memo(({ m }) => {
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
});
MessageBubble.displayName = 'MessageBubble';

// Thread list item (memo)
const ThreadListItem: React.FC<{
  thread: Thread;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  active?: boolean;
}> = React.memo(({ thread, onSelect, onDelete, active }) => {
  const latest = thread.messages.length ? thread.messages[thread.messages.length - 1] : null;
  return (
    <div
      onClick={() => onSelect(thread.id)}
      className={`cursor-pointer border rounded-xl p-3 hover:shadow-md transition ${
        active ? 'ring-2 ring-primary/30 bg-primary/5' : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="rounded-full px-2 py-1 text-xs bg-blue-50 text-blue-700 border-blue-100">
              {thread.type}
            </Badge>
            <div className="text-sm font-semibold">{thread.title}</div>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {latest ? `${latest.author === 'coach' ? 'You: ' : 'Client: '}${latest.content}` : 'Ingen meldinger enda'}
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="text-xs text-muted-foreground">{new Date(thread.createdAt).toLocaleDateString()}</div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e: any) => {
                e.stopPropagation();
                onDelete(thread.id);
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
ThreadListItem.displayName = 'ThreadListItem';

// Note item
const NoteItem: React.FC<{
  note: Note;
  onChangeStatus: (id: number, status: NoteStatus) => void;
  onDelete: (id: number) => void;
}> = React.memo(({ note, onChangeStatus, onDelete }) => {
  return (
    <div className={`border rounded-xl p-4 ${note.status === 'Resolved' ? 'bg-emerald-50/60' : 'bg-card'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm mb-2">{note.content}</p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{note.date}</span>
            <div className="ml-2">
              <StatusBadge status={note.status} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 ml-4">
          <div className="flex gap-2">
            {note.status !== 'Resolved' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onChangeStatus(
                    note.id,
                    note.status === 'Open' ? 'InReview' : note.status === 'InReview' ? 'Resolved' : 'Resolved'
                  )
                }
                className="h-8 w-8 p-0"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => onDelete(note.id)} className="h-8 w-8 p-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
NoteItem.displayName = 'NoteItem';

const CommunicationTab: React.FC<CommunicationTabProps> = ({ client }) => {
  // --- Messaging state ---
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadMessage, setNewThreadMessage] = useState('');
  const [allowResponse, setAllowResponse] = useState(true);

  // Mock initial data (in real app load from API)
  const [threads, setThreads] = useState<Thread[]>(() => {
    // some realistic mock
    return [
      {
        id: 1,
        title: 'Weekly check-in: energy + workouts',
        type: 'check-in',
        createdAt: '2024-09-10T09:00:00Z',
        respondable: true,
        messages: [
          {
            id: 101,
            author: 'coach',
            content: 'Hvordan føles treningen denne uken? Noe jeg skal justere?',
            date: '2024-09-10T09:00:00Z',
          },
          {
            id: 102,
            author: 'client',
            content: 'Bra! Litt sliten på onsdag men ok ellers.',
            date: '2024-09-10T14:22:00Z',
          },
        ],
      },
      {
        id: 2,
        title: 'Nutrition feedback week 36',
        type: 'feedback',
        createdAt: '2024-09-08T08:00:00Z',
        respondable: false,
        messages: [
          {
            id: 201,
            author: 'coach',
            content: 'Supert arbeid med måltidene denne uken — keep it up!',
            date: '2024-09-08T08:00:00Z',
          },
        ],
      },
    ];
  });

  // notes
  const [notes, setNotes] = useState<Note[]>(() => [
    {
      id: 1,
      content: 'Klient nevnte manglende motivasjon, vurder lettere load neste uke.',
      date: '2024-09-10',
      status: 'Open',
      internal: true,
    },
    {
      id: 2,
      content: 'Solid progresjon — legg til 2 ekstra sets for leg day.',
      date: '2024-09-08',
      status: 'InReview',
      internal: true,
    },
  ]);

  // selected thread
  const [activeThreadId, setActiveThreadId] = useState<number | null>(threads[0]?.id ?? null);

  // reply box for active thread
  const [replyText, setReplyText] = useState('');
  // lazy load pages for messages
  const [messagePages, setMessagePages] = useState<Record<number, number>>({}); // threadId -> pagesLoaded (1 page = last 10 messages)

  // --- Memoized derived data ---
  const threadIndex = useMemo(() => {
    const map = new Map<number, Thread>();
    threads.forEach((t) => map.set(t.id, t));
    return map;
  }, [threads]);

  const activeThread = useMemo(() => (activeThreadId ? threadIndex.get(activeThreadId) ?? null : null), [
    activeThreadId,
    threadIndex,
  ]);

  // limit shown messages (show most recent 10, option to load older)
  const visibleMessages = useMemo(() => {
    if (!activeThread) return [];
    const pages = messagePages[activeThread.id] ?? 1;
    const pageSize = 10;
    const total = activeThread.messages.length;
    const take = Math.min(total, pages * pageSize);
    return activeThread.messages.slice(Math.max(0, total - take), total);
  }, [activeThread, messagePages]);

  // --- Callbacks (useCallback for perf) ---
  const handleCreateThread = useCallback(() => {
    if (!newThreadTitle.trim() || !newThreadMessage.trim()) return;

    const nextId = Math.max(0, ...threads.map((t) => t.id)) + 1;
    const nextMsgId = Math.max(0, ...threads.flatMap((t) => t.messages.map((m) => m.id)), 0) + 1;
    const now = new Date().toISOString();
    const newThread: Thread = {
      id: nextId,
      title: newThreadTitle.trim(),
      type: 'check-in',
      createdAt: now,
      respondable: allowResponse,
      messages: [
        {
          id: nextMsgId,
          author: 'coach',
          content: newThreadMessage.trim(),
          date: now,
        },
      ],
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(nextId);
    setNewThreadTitle('');
    setNewThreadMessage('');
    // set initial page for this thread
    setMessagePages((prev) => ({ ...prev, [nextId]: 1 }));
  }, [newThreadTitle, newThreadMessage, allowResponse, threads]);

  const handleDeleteThread = useCallback(
    (id: number) => {
      setThreads((prev) => prev.filter((t) => t.id !== id));
      if (activeThreadId === id) {
        setActiveThreadId(null);
      }
    },
    [activeThreadId]
  );

  const handleReply = useCallback(() => {
    if (!activeThread || !replyText.trim()) return;

    const nextMsgId = Math.max(0, ...threads.flatMap((t) => t.messages.map((m) => m.id)), 0) + 1;
    const msg: Message = {
      id: nextMsgId,
      author: 'coach',
      content: replyText.trim(),
      date: new Date().toISOString(),
    };

    setThreads((prev) =>
      prev.map((t) => (t.id === activeThread.id ? { ...t, messages: [...t.messages, msg] } : t))
    );
    setReplyText('');
    // ensure page shows the newest
    setMessagePages((prev) => ({ ...prev, [activeThread.id]: Math.ceil((activeThread.messages.length + 1) / 10) }));
  }, [activeThread, replyText, threads]);

  // Simulate client response (for demo) - in real system this would be event-driven / webhook
  const simulateClientResponse = useCallback(
    (threadId: number, text = 'Takk — noted!') => {
      const nextMsgId = Math.max(0, ...threads.flatMap((t) => t.messages.map((m) => m.id)), 0) + 1;
      const msg: Message = {
        id: nextMsgId,
        author: 'client',
        content: text,
        date: new Date().toISOString(),
      };
      setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t)));
    },
    [threads]
  );

  // notes callbacks
  const handleAddNote = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      const id = Math.max(0, ...notes.map((n) => n.id)) + 1;
      const note: Note = {
        id,
        content: content.trim(),
        date: new Date().toISOString().split('T')[0],
        status: 'Open',
        internal: true,
      };
      setNotes((prev) => [note, ...prev]);
    },
    [notes]
  );

  const handleChangeNoteStatus = useCallback((id: number, status: NoteStatus) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
  }, []);

  const handleDeleteNote = useCallback((id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // pagination: load older messages
  const handleLoadOlderMessages = useCallback(
    (threadId: number) => {
      setMessagePages((prev) => ({ ...prev, [threadId]: (prev[threadId] ?? 1) + 1 }));
    },
    []
  );

  // Extract check-ins (threads of type check-in) and show if client responded
  const checkIns = useMemo(() => threads.filter((t) => t.type === 'check-in'), [threads]);

  // Controlled input for adding note in the UI
  const [noteDraft, setNoteDraft] = useState('');

  // minimal responsiveness: grid classes
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Compose / New Thread */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="h-5 w-5 text-blue-500" />
            Send Check-in / Start Thread
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="col-span-1 rounded-xl p-2 border bg-transparent text-sm"
              placeholder="Thread title (eks: Weekly check-in)"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
            />
            <div className="col-span-1 md:col-span-2">
              <Textarea
                placeholder="Skriv melding til klienten..."
                value={newThreadMessage}
                onChange={(e) => setNewThreadMessage(e.target.value)}
                className="min-h-[80px] rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Switch id="allow-response" checked={allowResponse} onCheckedChange={setAllowResponse} />
                <Label htmlFor="allow-response" className="text-sm">
                  Allow client to respond
                </Label>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  // quick demo: create quick draft thread
                  setNewThreadTitle('Quick check-in');
                  setNewThreadMessage('Hei! Hvordan går det med søvnen denne uken?');
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Quick draft
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateThread} className="rounded-full px-6" disabled={!newThreadTitle.trim() || !newThreadMessage.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main layout: left = threads & check-ins, right = active thread + notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: Threads + Check-ins */}
        <div className="space-y-4 lg:col-span-1">
          {/* Threads list */}
          <Card className="rounded-2xl border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-5 w-5 text-emerald-500" />
                Conversation Threads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
                {threads.length === 0 ? (
                  <div className="text-xs text-muted-foreground">Ingen tråder enda.</div>
                ) : (
                  threads.map((t) => (
                    <ThreadListItem
                      key={t.id}
                      thread={t}
                      onSelect={(id) => {
                        setActiveThreadId(id);
                        // ensure we show the latest page
                        setMessagePages((prev) => ({ ...prev, [id]: Math.ceil(t.messages.length / 10) || 1 }));
                      }}
                      onDelete={(id) => {
                        if (confirm('Slett tråd? Dette kan ikke angres.')) {
                          handleDeleteThread(id);
                        }
                      }}
                      active={activeThreadId === t.id}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Check-ins quick overview */}
          <Card className="rounded-2xl border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-amber-500" />
                Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checkIns.length === 0 && <div className="text-xs text-muted-foreground">Ingen check-ins</div>}
                {checkIns.map((c) => {
                  const last = c.messages[c.messages.length - 1];
                  const clientResponded = c.messages.some((m) => m.author === 'client');
                  return (
                    <div key={c.id} className="border rounded-xl p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold">{c.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{new Date(c.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs mt-2 line-clamp-2">{last?.content}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div>
                            {clientResponded ? (
                              <Badge className="rounded-full px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                                Client responded
                              </Badge>
                            ) : (
                              <Badge className="rounded-full px-2 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200">
                                Awaiting reply
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setActiveThreadId(c.id);
                                setMessagePages((prev) => ({ ...prev, [c.id]: Math.ceil(c.messages.length / 10) || 1 }));
                              }}
                            >
                              Open
                            </Button>
                            {!clientResponded && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (confirm('Simulate client response for demo?')) {
                                    simulateClientResponse(c.id, 'Ja, jeg svarte faktisk nå (demo).');
                                  }
                                }}
                              >
                                Simulate reply
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Active thread + Notes (spans 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active thread detail */}
          <Card className="rounded-2xl border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-5 w-5 text-emerald-500" />
                Thread
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!activeThread ? (
                <div className="text-sm text-muted-foreground">Velg en tråd fra venstre for å se meldinger</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{activeThread.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(activeThread.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="rounded-full px-2 py-1 text-xs bg-blue-50 text-blue-700 border-blue-100">
                        {activeThread.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // archive toggle demo
                          setThreads((prev) => prev.map((t) => (t.id === activeThread.id ? { ...t, archived: !t.archived } : t)));
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm('Slett denne tråden permanent?')) {
                            handleDeleteThread(activeThread.id);
                          }
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 max-h-[360px] overflow-auto p-2 border rounded-lg">
                    {/* Load older */}
                    {activeThread.messages.length > (messagePages[activeThread.id] ?? 1) * 10 && (
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadOlderMessages(activeThread.id)}
                        >
                          Load older messages
                        </Button>
                      </div>
                    )}

                    {/* Message list */}
                    <div className="flex flex-col gap-2">
                      {visibleMessages.map((m) => (
                        <MessageBubble key={m.id} m={m} />
                      ))}
                    </div>
                  </div>

                  {/* Reply box */}
                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-3">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={activeThread.respondable ? 'Skriv svar...' : 'Denne tråden tillater ikke svar.'}
                          className="min-h-[80px] rounded-xl"
                          disabled={!activeThread.respondable}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button onClick={handleReply} disabled={!replyText.trim() || !activeThread.respondable}>
                          <Send className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            // quick simulate client reply for testing
                            if (activeThread) simulateClientResponse(activeThread.id, 'Client quick reply (demo).');
                          }}
                        >
                          Simulate client reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coach Notes - private with statuses */}
          <Card className="rounded-2xl border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <StickyNote className="h-5 w-5 text-amber-500" />
                Private Coach Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Textarea
                    placeholder="Add a private note about this client..."
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    className="min-h-[100px] rounded-xl md:col-span-2"
                  />
                  <div className="flex flex-col gap-2 items-end">
                    <div className="text-xs text-muted-foreground">Note status: Open by default</div>
                    <div className="w-full">
                      <Button
                        onClick={() => {
                          handleAddNote(noteDraft);
                          setNoteDraft('');
                        }}
                        disabled={!noteDraft.trim()}
                        className="rounded-full px-4 w-full"
                      >
                        <StickyNote className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notes list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {notes.length === 0 && <div className="text-xs text-muted-foreground">Ingen notater enda.</div>}
                  {notes.map((n) => (
                    <NoteItem
                      key={n.id}
                      note={n}
                      onChangeStatus={(id, status) => handleChangeNoteStatus(id, status)}
                      onDelete={(id) => {
                        if (confirm('Slett notat?')) handleDeleteNote(id);
                      }}
                    />
                  ))}
                </div>

                {/* Follow-up quick summary */}
                <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                        <span className="text-sm font-medium text-rose-700">Follow-up summary</span>
                      </div>
                      <p className="text-xs text-rose-600 mt-1">
                        {notes.filter((n) => n.status !== 'Resolved').length} unresolved notes requiring attention
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // clear follow-ups: mark all as resolved (demo)
                          if (confirm('Mark all as resolved?')) {
                            setNotes((prev) => prev.map((n) => ({ ...n, status: 'Resolved' })));
                          }
                        }}
                        className="border-rose-300 text-rose-700 hover:bg-rose-100"
                      >
                        Clear Follow-up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunicationTab;
