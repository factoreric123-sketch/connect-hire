import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import WorkerCard from '@/components/workers/WorkerCard';
import JobCard from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { useAuth } from '@/contexts/AuthContext';
import { workerService, jobService, savedWorkerService } from '@/lib/database';
import { SKILLS, COUNTRIES } from '@/data/mockData';
import { X, Plus, User, Briefcase, Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { WorkerProfile, Job } from '@/types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const navigate = useNavigate();
  const { workerProfile, updateWorkerProfile, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [formData, setFormData] = useState({
    name: workerProfile?.name || '',
    headline: workerProfile?.headline || '',
    bio: workerProfile?.bio || '',
    country: workerProfile?.countryCode || '',
    skills: workerProfile?.skills || [],
    hourlyRateMin: workerProfile?.hourlyRateMin?.toString() || '1',
    hourlyRateMax: workerProfile?.hourlyRateMax?.toString() || '3',
    availabilityHours: workerProfile?.availabilityHours?.toString() || '8',
    avatar: workerProfile?.avatar || '',
  });

  useEffect(() => {
    if (workerProfile) {
      setFormData({
        name: workerProfile.name,
        headline: workerProfile.headline,
        bio: workerProfile.bio,
        country: workerProfile.countryCode,
        skills: workerProfile.skills,
        hourlyRateMin: workerProfile.hourlyRateMin.toString(),
        hourlyRateMax: workerProfile.hourlyRateMax.toString(),
        availabilityHours: workerProfile.availabilityHours.toString(),
        avatar: workerProfile.avatar || '',
      });
    }
  }, [workerProfile]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoadingJobs(true);
      const data = await jobService.getAll({ limit: 10 });
      setJobs(data.map((j: any) => ({
        id: j.id,
        employerId: j.employer_id,
        employerName: j.employer?.company_name || 'Unknown',
        title: j.title,
        description: j.description,
        skills: j.skills,
        hourlyRateMin: Number(j.hourly_rate_min),
        hourlyRateMax: Number(j.hourly_rate_max),
        availabilityHours: j.availability_hours,
        countryPreference: j.country_preference,
        createdAt: j.created_at,
        isActive: j.is_active,
      })));
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const country = COUNTRIES.find(c => c.code === formData.country);
      await updateWorkerProfile({
        name: formData.name,
        headline: formData.headline,
        bio: formData.bio,
        countryCode: formData.country,
        country: country?.name || '',
        skills: formData.skills,
        hourlyRateMin: parseFloat(formData.hourlyRateMin) || 1,
        hourlyRateMax: parseFloat(formData.hourlyRateMax) || 3,
        availabilityHours: parseInt(formData.availabilityHours) || 8,
        avatar: formData.avatar,
      });
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    setFormData({ ...formData, avatar: url });
    try {
      await updateWorkerProfile({ avatar: url });
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
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
                  <p className="text-sm text-muted-foreground mt-1">This is what employers will see</p>
                </div>
                <Button onClick={() => editing ? handleSave() : setEditing(true)} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editing ? 'Save Changes' : 'Edit Profile'
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {editing ? (
                  <>
                    {user && workerProfile && (
                      <div className="flex justify-center mb-4">
                        <AvatarUpload
                          currentAvatar={formData.avatar}
                          onUploadComplete={handleAvatarUpload}
                          userId={user.id}
                          name={formData.name}
                        />
                      </div>
                    )}
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
            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { employerProfile } = useAuth();
  const [savedWorkers, setSavedWorkers] = useState<WorkerProfile[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    if (employerProfile) {
      loadSavedWorkers();
      loadMyJobs();
    }
  }, [employerProfile]);

  const loadSavedWorkers = async () => {
    if (!employerProfile) return;
    
    try {
      setIsLoadingSaved(true);
      const data = await savedWorkerService.getByEmployerId(employerProfile.id);
      const workers = data.map((item: any) => ({
        id: item.worker.id,
        userId: item.worker.user_id,
        name: item.worker.name,
        avatar: item.worker.avatar_url || undefined,
        country: item.worker.country,
        countryCode: item.worker.country_code,
        headline: item.worker.headline,
        skills: item.worker.skills,
        hourlyRateMin: Number(item.worker.hourly_rate_min),
        hourlyRateMax: Number(item.worker.hourly_rate_max),
        availabilityHours: item.worker.availability_hours,
        availabilityType: item.worker.availability_type,
        bio: item.worker.bio,
        lastActive: item.worker.last_active,
        isVerified: item.worker.is_verified,
        reviewCount: item.worker.review_count,
        averageRating: Number(item.worker.average_rating),
      }));
      setSavedWorkers(workers);
    } catch (error) {
      console.error('Error loading saved workers:', error);
      toast.error('Failed to load saved workers');
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const loadMyJobs = async () => {
    if (!employerProfile) return;
    
    try {
      setIsLoadingJobs(true);
      const data = await jobService.getByEmployerId(employerProfile.id);
      const jobs = data.map((j: any) => ({
        id: j.id,
        employerId: j.employer_id,
        employerName: employerProfile.companyName,
        title: j.title,
        description: j.description,
        skills: j.skills,
        hourlyRateMin: Number(j.hourly_rate_min),
        hourlyRateMax: Number(j.hourly_rate_max),
        availabilityHours: j.availability_hours,
        countryPreference: j.country_preference,
        createdAt: j.created_at,
        isActive: j.is_active,
      }));
      setMyJobs(jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load your jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  };

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
              Saved Workers ({savedWorkers.length})
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              My Jobs ({myJobs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {isLoadingSaved ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : savedWorkers.length > 0 ? (
              <div className="grid gap-4">
                {savedWorkers.map(worker => (
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
            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : myJobs.length > 0 ? (
              <div className="grid gap-4">
                {myJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
