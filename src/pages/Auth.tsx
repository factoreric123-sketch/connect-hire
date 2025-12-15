import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types';
import { toast } from 'sonner';
import { User, Briefcase, Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, user, isLoading: authLoading } = useAuth();

  const initialMode = searchParams.get('mode') || 'login';
  const initialType = (searchParams.get('type') as UserType) || 'employer';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode as 'login' | 'signup');
  const [userType, setUserType] = useState<UserType>(initialType);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success: boolean;
      
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
      } else {
        if (!formData.name) {
          toast.error('Please enter your name');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        success = await signup(formData.email, formData.password, userType, formData.name);
      }

      if (success && mode === 'login') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Log in to access your dashboard' 
                : 'Join ConnectWork to start connecting'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={v => setMode(v as 'login' | 'signup')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* User Type Selection - Only for Signup */}
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setUserType('employer')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    userType === 'employer'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <Briefcase className={`h-6 w-6 mx-auto mb-2 ${userType === 'employer' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className={`text-sm font-medium ${userType === 'employer' ? 'text-primary' : 'text-muted-foreground'}`}>
                    I'm Hiring
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('worker')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    userType === 'worker'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <User className={`h-6 w-6 mx-auto mb-2 ${userType === 'worker' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className={`text-sm font-medium ${userType === 'worker' ? 'text-primary' : 'text-muted-foreground'}`}>
                    I'm a Worker
                  </p>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {userType === 'employer' ? 'Company Name' : 'Full Name'}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={userType === 'employer' ? 'Your company name' : 'Your full name'}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  mode === 'login' ? 'Log In' : 'Create Account'
                )}
              </Button>
            </form>

            {mode === 'signup' && (
              <p className="mt-4 text-xs text-center text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
