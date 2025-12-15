import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Building } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const timeAgo = () => {
    const diff = Date.now() - new Date(job.createdAt).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Building className="h-4 w-4" />
              <span>{job.employerName}</span>
            </div>
            
            <Link to={`/jobs/${job.id}`}>
              <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
                {job.title}
              </h3>
            </Link>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 4).map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 4}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm">
              <span className="font-medium text-primary">
                ${job.hourlyRateMin}-${job.hourlyRateMax}/hr
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.availabilityHours}h/day
              </span>
              {job.countryPreference && (
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.countryPreference}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Posted {timeAgo()}
          </span>
          <Link to={`/jobs/${job.id}`}>
            <Button size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
