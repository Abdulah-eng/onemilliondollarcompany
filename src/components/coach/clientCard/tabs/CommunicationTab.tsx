import React, { useState } from 'react';
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
  User
} from 'lucide-react';

interface CommunicationTabProps {
  client: any;
}

const CommunicationTab: React.FC<CommunicationTabProps> = ({ client }) => {
  const [message, setMessage] = useState('');
  const [allowResponse, setAllowResponse] = useState(true);
  const [newNote, setNewNote] = useState('');

  // Mock data
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'Client mentioned feeling unmotivated this week. Consider adjusting workout intensity.',
      date: '2024-09-10',
      resolved: false
    },
    {
      id: 2,
      content: 'Great progress on nutrition goals. Continue current meal plan.',
      date: '2024-09-08',
      resolved: true
    }
  ]);

  const [communications, setCommunications] = useState([
    {
      id: 1,
      type: 'check-in',
      content: 'How are you feeling about your current workout routine?',
      date: '2024-09-10',
      respondable: true,
      hasResponse: true,
      response: 'Feeling great! The new exercises are challenging but fun.'
    },
    {
      id: 2,
      type: 'feedback',
      content: 'Excellent work on your nutrition goals this week! Keep it up.',
      date: '2024-09-08',
      respondable: false,
      hasResponse: false
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newComm = {
        id: communications.length + 1,
        type: 'check-in',
        content: message,
        date: new Date().toISOString().split('T')[0],
        respondable: allowResponse,
        hasResponse: false
      };
      setCommunications([newComm, ...communications]);
      setMessage('');
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: notes.length + 1,
        content: newNote,
        date: new Date().toISOString().split('T')[0],
        resolved: false
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const handleResolveNote = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, resolved: true } : note
    ));
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Send Check-in */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="h-5 w-5 text-blue-500" />
            Send Check-in to Client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your check-in message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] rounded-xl"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-response"
                checked={allowResponse}
                onCheckedChange={setAllowResponse}
              />
              <Label htmlFor="allow-response" className="text-sm">
                Allow client to respond
              </Label>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="rounded-full px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Check-in
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communications.map((comm) => (
              <div key={comm.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="rounded-full px-2 py-1 text-xs bg-blue-100 text-blue-700 border-blue-200">
                        {comm.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{comm.date}</span>
                      {comm.respondable && (
                        <Badge className="rounded-full px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                          Respondable
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{comm.content}</p>
                    {comm.hasResponse && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium">Client Response</span>
                        </div>
                        <p className="text-sm">{comm.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coach Notes */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <StickyNote className="h-5 w-5 text-amber-500" />
            Private Coach Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Note */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add a private note about this client..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px] rounded-xl"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                size="sm"
                className="rounded-full px-4"
              >
                <StickyNote className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>

          {/* Existing Notes */}
          <div className="space-y-3">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className={`border rounded-xl p-4 ${
                  note.resolved ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm mb-2">{note.content}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                      {note.resolved ? (
                        <Badge className="rounded-full px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge className="rounded-full px-2 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!note.resolved && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleResolveNote(note.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Follow-up Status */}
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span className="text-sm font-medium text-rose-700">Client Marked for Follow-up</span>
                </div>
                <p className="text-xs text-rose-600 mt-1">2 unresolved notes requiring attention</p>
              </div>
              <Button size="sm" variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-100">
                Clear Follow-up
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommunicationTab;
