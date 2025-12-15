import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>

        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Messaging Coming Soon</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              In-app messaging will be available once the database is set up. 
              For now, contact information will be shared when you express interest in a worker or job.
            </p>
            <Button onClick={() => navigate(user.userType === 'employer' ? '/workers' : '/jobs')}>
              {user.userType === 'employer' ? 'Find Workers' : 'Browse Jobs'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
