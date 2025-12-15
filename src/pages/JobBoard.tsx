import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import JobCard from '@/components/jobs/JobCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { jobService } from '@/lib/database';
import { Job } from '@/types';
import { SKILLS } from '@/data/mockData';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const JobBoardPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rate-high' | 'rate-low'>('newest');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [search, skillFilter, sortBy]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const data = await jobService.getAll({
        search,
        skills: skillFilter !== 'all' ? skillFilter : undefined,
        sortBy,
        limit: 50,
      });

      const convertedJobs: Job[] = data.map((j: any) => ({
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
      }));

      setJobs(convertedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Board</h1>
          <p className="text-muted-foreground">
            Browse open positions from employers worldwide
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs..."
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {SKILLS.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rate-high">Highest Rate</SelectItem>
              <SelectItem value="rate-low">Lowest Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Skill Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SKILLS.slice(0, 10).map(skill => (
            <Badge
              key={skill}
              variant={skillFilter === skill ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSkillFilter(skillFilter === skill ? 'all' : skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">
          {isLoading ? 'Loading...' : `Showing ${jobs.length} job${jobs.length !== 1 ? 's' : ''}`}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoardPage;
