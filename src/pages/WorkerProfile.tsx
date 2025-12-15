import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { workerService, reviewService, employerService, conversationService } from '@/lib/database';
import { getCountryFlag, formatLastActive } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { WorkerProfile, Review } from '@/types';
import { 
  Star, Clock, CheckCircle, Heart, MessageSquare, 
  ArrowLeft, Calendar, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isWorkerSaved, saveWorker, unsaveWorker, employerProfile } = useAuth();
  
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkerProfile(id);
    }
  }, [id]);

  const loadWorkerProfile = async (workerId: string) => {
    try {
      setIsLoading(true);
      const [workerData, reviewData] = await Promise.all([
        workerService.getById(workerId),
        reviewService.getByWorkerId(workerId),
      ]);

      setWorker({
        id: workerData.id,
        userId: workerData.user_id,
        name: workerData.name,
        avatar: workerData.avatar_url || undefined,
        country: workerData.country,
        countryCode: workerData.country_code,
        headline: workerData.headline,
        skills: workerData.skills,
        hourlyRateMin: Number(workerData.hourly_rate_min),
        hourlyRateMax: Number(workerData.hourly_rate_max),
        availabilityHours: workerData.availability_hours,
        availabilityType: workerData.availability_type,
        bio: workerData.bio,
        lastActive: workerData.last_active,
        isVerified: workerData.is_verified,
        reviewCount: workerData.review_count,
        averageRating: Number(workerData.average_rating),
      });

      setReviews(reviewData.map((r: any) => ({
        id: r.id,
        workerId: r.worker_id,
        employerId: r.employer_id,
        employerName: r.employer?.company_name || 'Anonymous',
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
      })));
    } catch (error) {
      console.error('Error loading worker profile:', error);
      toast.error('Failed to load worker profile');
    } finally {
      setIsLoading(false);
    }
  };

  const isSaved = worker ? isWorkerSaved(worker.id) : false;

  const handleSave = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!worker) return;

    try {
      setIsSaving(true);
      if (isSaved) {
        await unsaveWorker(worker.id);
      } else {
        await saveWorker(worker.id);
      }
    } catch (error) {
      console.error('Error saving worker:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContact = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!worker || !employerProfile) {
      toast.error('You must be logged in as an employer to contact workers');
      return;
    }

    try {
      setIsContacting(true);
      const conversation = await conversationService.getOrCreate(worker.id, employerProfile.id);
      navigate(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    } finally {
      setIsContacting(false);
    }
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

  if (!worker) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Worker not found</h1>
          <Button onClick={() => navigate('/workers')}>Back to Search</Button>
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
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative shrink-0">
                    <img
                      src={worker.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random&size=128`}
                      alt={worker.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-border"
                    />
                    {worker.isVerified && (
                      <CheckCircle className="absolute -bottom-2 -right-2 h-8 w-8 text-accent fill-background" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">{worker.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-1 mt-1">
                          <span className="text-lg">{getCountryFlag(worker.countryCode)}</span>
                          {worker.country}
                        </p>
                      </div>
                      {worker.reviewCount > 0 && (
                        <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg">
                          <Star className="h-5 w-5 fill-warning text-warning" />
                          <span className="font-semibold">{worker.averageRating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-sm">({worker.reviewCount})</span>
                        </div>
                      )}
                    </div>

                    <p className="text-lg text-foreground mt-3">{worker.headline}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {worker.skills.map(skill => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{worker.bio || 'No bio provided yet.'}</p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="divide-y divide-border">
                    {reviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    ${worker.hourlyRateMin}-${worker.hourlyRateMax}
                  </p>
                  <p className="text-sm text-muted-foreground">per hour</p>
                </div>

                <div className="space-y-3 py-4 border-y border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{worker.availabilityHours} hours/day • {worker.availabilityType}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatLastActive(worker.lastActive)}</span>
                  </div>
                  {worker.isVerified && (
                    <div className="flex items-center gap-3 text-sm text-accent">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verified Worker</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleContact}
                    disabled={isContacting}
                  >
                    {isContacting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Contact Worker
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-destructive text-destructive' : ''}`} />
                    )}
                    {isSaved ? 'Saved' : 'Save Profile'}
                  </Button>
                </div>

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

export default WorkerProfilePage;
