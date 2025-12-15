import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { jobService, workerService, employerService, conversationService } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from '@/types';
import { ArrowLeft, Building, Clock, MapPin, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, workerProfile } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob(id);
    }
  }, [id]);

  const loadJob = async (jobId: string) => {
    try {
      setIsLoading(true);
      const data = await jobService.getById(jobId);
      
      setJob({
        id: data.id,
        employerId: data.employer_id,
        employerName: data.employer?.company_name || 'Unknown',
        title: data.title,
        description: data.description,
        skills: data.skills,
        hourlyRateMin: Number(data.hourly_rate_min),
        hourlyRateMax: Number(data.hourly_rate_max),
        availabilityHours: data.availability_hours,
        countryPreference: data.country_preference,
        createdAt: data.created_at,
        isActive: data.is_active,
      });
    } catch (error) {
      console.error('Error loading job:', error);
      toast.error('Failed to load job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!job || !workerProfile) {
      toast.error('You must be logged in as a worker to apply for jobs');
      return;
    }

    try {
      setIsApplying(true);
      // Get employer profile
      const employer = await employerService.getById(job.employerId);
      // Create or get conversation
      const conversation = await conversationService.getOrCreate(workerProfile.id, employer.id);
      navigate(`/messages?conversation=${conversation.id}`);
      toast.success('You can now contact the employer about this job!');
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Failed to start conversation');
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Building className="h-4 w-4" />
                  <span>{job.employerName}</span>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-4">{job.title}</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-medium">${job.hourlyRateMin}-${job.hourlyRateMax}/hr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{job.availabilityHours} hours/day</span>
                  </div>
                  {job.countryPreference && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.countryPreference}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="text-sm py-1.5 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    ${job.hourlyRateMin}-${job.hourlyRateMax}
                  </p>
                  <p className="text-sm text-muted-foreground">per hour</p>
                </div>

                <div className="space-y-3 py-4 border-y border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{job.availabilityHours} hours/day required</span>
                  </div>
                  {job.countryPreference ? (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Preferred: {job.countryPreference}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Open to all countries</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleApply}
                  disabled={isApplying}
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Express Interest'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  All hiring arrangements are made directly between parties off-platform
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
