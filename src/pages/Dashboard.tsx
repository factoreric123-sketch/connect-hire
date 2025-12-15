import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import WorkerCard from '@/components/workers/WorkerCard';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { mockWorkers, mockJobs, SKILLS, COUNTRIES } from '@/data/mockData';
import { X, Plus, User, Briefcase, Heart, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, workerProfile, employerProfile, updateWorkerProfile, updateEmployerProfile, savedWorkers } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
          <Button onClick={() => navigate('/auth')}>Log In</Button>
        </div>
      </div>
    );
  }

  if (user.userType === 'worker') {
    return <WorkerDashboard />;
  }

  return <EmployerDashboard />;
};

const WorkerDashboard: React.FC = () => {
  const { workerProfile, updateWorkerProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: workerProfile?.name || '',
    headline: workerProfile?.headline || '',
    bio: workerProfile?.bio || '',
    country: workerProfile?.countryCode || '',
    skills: workerProfile?.skills || [],
    hourlyRateMin: workerProfile?.hourlyRateMin?.toString() || '1',
    hourlyRateMax: workerProfile?.hourlyRateMax?.toString() || '3',
    availabilityHours: workerProfile?.availabilityHours?.toString() || '8',
  });

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSave = () => {
    const country = COUNTRIES.find(c => c.code === formData.country);
    updateWorkerProfile({
      name: formData.name,
      headline: formData.headline,
      bio: formData.bio,
      countryCode: formData.country,
      country: country?.name || '',
      skills: formData.skills,
      hourlyRateMin: parseFloat(formData.hourlyRateMin) || 1,
      hourlyRateMax: parseFloat(formData.hourlyRateMax) || 3,
      availabilityHours: parseInt(formData.availabilityHours) || 8,
      lastActive: new Date().toISOString(),
    });
    setEditing(false);
    toast.success('Profile updated!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Worker Dashboard</h1>
            <p className="text-muted-foreground">Manage your profile and view opportunities</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>This is what employers will see</CardDescription>
                </div>
                <Button onClick={() => editing ? handleSave() : setEditing(true)}>
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {editing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Headline</Label>
                      <Input
                        placeholder="e.g., Experienced Virtual Assistant"
                        value={formData.headline}
                        onChange={e => setFormData({ ...formData, headline: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Select value={formData.country} onValueChange={v => setFormData({ ...formData, country: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(c => (
                            <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea
                        rows={4}
                        placeholder="Tell employers about yourself..."
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Skills</Label>
                      {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.skills.map(skill => (
                            <Badge key={skill} variant="default" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                              {skill} <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {SKILLS.filter(s => !formData.skills.includes(s)).map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover:bg-secondary"
                            onClick={() => addSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Min Rate ($/hr)</Label>
                        <Input
                          type="number"
                          value={formData.hourlyRateMin}
                          onChange={e => setFormData({ ...formData, hourlyRateMin: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Rate ($/hr)</Label>
                        <Input
                          type="number"
                          value={formData.hourlyRateMax}
                          onChange={e => setFormData({ ...formData, hourlyRateMax: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hours/Day</Label>
                        <Input
                          type="number"
                          value={formData.availabilityHours}
                          onChange={e => setFormData({ ...formData, availabilityHours: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p><strong>Name:</strong> {workerProfile?.name || 'Not set'}</p>
                    <p><strong>Headline:</strong> {workerProfile?.headline || 'Not set'}</p>
                    <p><strong>Country:</strong> {workerProfile?.country || 'Not set'}</p>
                    <p><strong>Bio:</strong> {workerProfile?.bio || 'Not set'}</p>
                    <div>
                      <strong>Skills:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {workerProfile?.skills.length ? workerProfile.skills.map(s => (
                          <Badge key={s} variant="secondary">{s}</Badge>
                        )) : <span className="text-muted-foreground">No skills added</span>}
                      </div>
                    </div>
                    <p><strong>Rate:</strong> ${workerProfile?.hourlyRateMin}-${workerProfile?.hourlyRateMax}/hr</p>
                    <p><strong>Availability:</strong> {workerProfile?.availabilityHours} hours/day</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="grid gap-4">
              {mockJobs.filter(j => j.isActive).map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { savedWorkers } = useAuth();
  
  const savedWorkerProfiles = mockWorkers.filter(w => 
    savedWorkers.some(sw => sw.workerId === w.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employer Dashboard</h1>
            <p className="text-muted-foreground">Manage your jobs and saved workers</p>
          </div>
          <Button onClick={() => navigate('/post-job')}>
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Button>
        </div>

        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList>
            <TabsTrigger value="saved">
              <Heart className="h-4 w-4 mr-2" />
              Saved Workers ({savedWorkerProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              My Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {savedWorkerProfiles.length > 0 ? (
              <div className="grid gap-4">
                {savedWorkerProfiles.map(worker => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved workers yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse workers and save the ones you're interested in
                  </p>
                  <Button onClick={() => navigate('/workers')}>Find Workers</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Post your first job</h3>
                <p className="text-muted-foreground mb-4">
                  Create a job listing to attract talented workers
                </p>
                <Button onClick={() => navigate('/post-job')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
