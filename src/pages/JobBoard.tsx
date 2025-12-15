import React, { useState, useMemo } from 'react';
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
import { mockJobs, SKILLS } from '@/data/mockData';
import { Search } from 'lucide-react';

const JobBoardPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredJobs = useMemo(() => {
    let jobs = [...mockJobs].filter(job => job.isActive);

    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(
        job =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.skills.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    if (skillFilter && skillFilter !== 'all') {
      jobs = jobs.filter(job => job.skills.includes(skillFilter));
    }

    if (sortBy === 'newest') {
      jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'rate-high') {
      jobs.sort((a, b) => b.hourlyRateMax - a.hourlyRateMax);
    } else if (sortBy === 'rate-low') {
      jobs.sort((a, b) => a.hourlyRateMin - b.hourlyRateMin);
    }

    return jobs;
  }, [search, skillFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Board</h1>
          <p className="text-muted-foreground">
            Browse {mockJobs.filter(j => j.isActive).length} open positions from employers worldwide
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

          <Select value={sortBy} onValueChange={setSortBy}>
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
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </p>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.map(job => (
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
