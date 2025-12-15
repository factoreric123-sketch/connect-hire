import React from 'react';
import { Review } from '@/types';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="py-4 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">{review.employerName}</p>
          <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
