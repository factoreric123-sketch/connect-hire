import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { conversationService, messageService } from '@/lib/database';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ConversationData {
  id: string;
  workerId: string;
  employerId: string;
  workerName: string;
  employerName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

interface MessageData {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, supabaseUser } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
      const convId = searchParams.get('conversation');
      if (convId) {
        setSelectedConversation(convId);
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      subscribeToMessages(selectedConversation);
    }
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await conversationService.getByUserId(user.id, user.userType);
      
      const converted: ConversationData[] = data.map((c: any) => ({
        id: c.id,
        workerId: c.worker_id,
        employerId: c.employer_id,
        workerName: c.worker?.name || 'Worker',
        employerName: c.employer?.company_name || 'Employer',
        lastMessage: c.last_message,
        lastMessageAt: c.last_message_at,
      }));

      setConversations(converted);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await messageService.getByConversationId(conversationId);
      setMessages(data.map((m: any) => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        content: m.content,
        isRead: m.is_read,
        createdAt: m.created_at,
      })));

      // Mark messages as read
      if (supabaseUser) {
        await messageService.markAsRead(conversationId, supabaseUser.id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const subscribeToMessages = (conversationId: string) => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    channelRef.current = messageService.subscribeToConversation(
      conversationId,
      (newMessage) => {
        setMessages((prev) => [...prev, {
          id: newMessage.id,
          conversationId: newMessage.conversation_id,
          senderId: newMessage.sender_id,
          content: newMessage.content,
          isRead: newMessage.is_read,
          createdAt: newMessage.created_at,
        }]);
        
        // Update conversation list
        loadConversations();
      }
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !supabaseUser) return;

    try {
      setIsSending(true);
      await messageService.create({
        conversation_id: selectedConversation,
        sender_id: supabaseUser.id,
        content: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view messages</h1>
          <Button onClick={() => navigate('/auth')}>Log In</Button>
        </div>
      </div>
    );
  }

  const selectedConvo = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : conversations.length > 0 ? (
                <div className="divide-y divide-border overflow-y-auto max-h-[calc(100vh-300px)]">
                  {conversations.map(convo => (
                    <button
                      key={convo.id}
                      onClick={() => setSelectedConversation(convo.id)}
                      className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                        selectedConversation === convo.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {(user.userType === 'employer' ? convo.workerName : convo.employerName).charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {user.userType === 'employer' ? convo.workerName : convo.employerName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {convo.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No conversations yet</p>
                  <Button onClick={() => navigate(user.userType === 'employer' ? '/workers' : '/jobs')}>
                    {user.userType === 'employer' ? 'Find Workers' : 'Browse Jobs'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedConvo ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {(user.userType === 'employer' ? selectedConvo.workerName : selectedConvo.employerName).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.userType === 'employer' ? selectedConvo.workerName : selectedConvo.employerName}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center text-sm text-muted-foreground">
                    All hiring arrangements are made directly between parties off-platform.
                    ConnectWork does not facilitate payments or contracts.
                  </div>
                  
                  {messages.map(message => {
                    const isOwn = message.senderId === supabaseUser?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="flex-1"
                      disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
