import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { mockConversations, mockMessages, mockWorkers } from '@/data/mockData';
import { Send, ArrowLeft } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

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

  const conversations = mockConversations;
  const selectedConvo = conversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation 
    ? mockMessages.filter(m => m.conversationId === selectedConversation)
    : [];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardContent className="p-0">
              {conversations.length > 0 ? (
                <div className="divide-y divide-border">
                  {conversations.map(convo => (
                    <button
                      key={convo.id}
                      onClick={() => setSelectedConversation(convo.id)}
                      className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                        selectedConversation === convo.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {(user.userType === 'employer' ? convo.workerName : convo.employerName).charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {user.userType === 'employer' ? convo.workerName : convo.employerName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                        </div>
                        {convo.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No conversations yet</p>
                  <Button className="mt-4" onClick={() => navigate('/workers')}>
                    Find Workers
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
                    const isOwn = 
                      (user.userType === 'employer' && message.senderId === selectedConvo.employerId) ||
                      (user.userType === 'worker' && message.senderId === selectedConvo.workerId);
                    
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
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-border">
                  <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
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
