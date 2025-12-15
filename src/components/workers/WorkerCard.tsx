import React from 'react';
import { Link } from 'react-router-dom';
import { WorkerProfile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, CheckCircle, Heart, HeartOff } from 'lucide-react';
import { getCountryFlag, formatLastActive } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface WorkerCardProps {
  worker: WorkerProfile;
  onContact?: () => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onContact }) => {
  const { user, isWorkerSaved, saveWorker, unsaveWorker } = useAuth();
  const isSaved = isWorkerSaved(worker.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      unsaveWorker(worker.id);
    } else {
      saveWorker(worker.id);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Link to={`/workers/${worker.id}`} className="shrink-0">
            <div className="relative">
              <img
                src={worker.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random`}
                alt={worker.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
              {worker.isVerified && (
                <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-accent fill-background" />
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to={`/workers/${worker.id}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors truncate">
                    {worker.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>{getCountryFlag(worker.countryCode)}</span>
                  <span>{worker.country}</span>
                </p>
              </div>
              
              {user?.userType === 'employer' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={handleSave}
                >
                  {isSaved ? (
                    <Heart className="h-4 w-4 fill-destructive text-destructive" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {worker.headline}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {worker.skills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {worker.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{worker.skills.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="font-medium text-primary">
                ${worker.hourlyRateMin}-${worker.hourlyRateMax}/hr
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {worker.availabilityHours}h/day
              </span>
              {worker.reviewCount > 0 && (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  {worker.averageRating.toFixed(1)} ({worker.reviewCount})
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {formatLastActive(worker.lastActive)}
              </span>
              <Link to={`/workers/${worker.id}`}>
                <Button size="sm" variant="outline" className="h-8">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerCard;
