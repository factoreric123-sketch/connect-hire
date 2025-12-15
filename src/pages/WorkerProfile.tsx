import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import ReviewCard from '@/components/reviews/ReviewCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockWorkers, mockReviews, getCountryFlag, formatLastActive } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Star, Clock, CheckCircle, Heart, MessageSquare, 
  ArrowLeft, MapPin, Calendar 
} from 'lucide-react';
import { toast } from 'sonner';

const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isWorkerSaved, saveWorker, unsaveWorker } = useAuth();
  
  const worker = mockWorkers.find(w => w.id === id);
  const reviews = mockReviews.filter(r => r.workerId === id);
  const isSaved = worker ? isWorkerSaved(worker.id) : false;

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

  const handleSave = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (isSaved) {
      unsaveWorker(worker.id);
      toast.success('Removed from saved workers');
    } else {
      saveWorker(worker.id);
      toast.success('Worker saved!');
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/messages', { state: { workerId: worker.id } });
    toast.success('Starting conversation...');
  };

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
                <p className="text-muted-foreground whitespace-pre-wrap">{worker.bio}</p>
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
                  <Button className="w-full" size="lg" onClick={handleContact}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Worker
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSave}>
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-destructive text-destructive' : ''}`} />
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
