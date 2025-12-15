import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import WorkerCard from '@/components/workers/WorkerCard';
import FilterSidebar from '@/components/workers/FilterSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { workerService } from '@/lib/database';
import { FilterState, WorkerProfile } from '@/types';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultFilters: FilterState = {
  search: '',
  country: 'all',
  minRate: 0,
  maxRate: 10,
  minHours: 0,
  maxHours: 12,
  verifiedOnly: false,
  lastActive: 'any',
  skills: [],
};

const WorkerSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialSkills = searchParams.get('skills')?.split(',').filter(Boolean) || [];

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    search: initialSearch,
    skills: initialSkills,
  });
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkers();
  }, [filters]);

  const loadWorkers = async () => {
    try {
      setIsLoading(true);
      const data = await workerService.getAll({
        country: filters.country,
        minRate: filters.minRate,
        maxRate: filters.maxRate,
        minHours: filters.minHours,
        maxHours: filters.maxHours,
        verifiedOnly: filters.verifiedOnly,
        skills: filters.skills,
        search: filters.search,
        limit: 50,
      });

      // Convert database format to app format
      const convertedWorkers: WorkerProfile[] = data.map(w => ({
        id: w.id,
        userId: w.user_id,
        name: w.name,
        avatar: w.avatar_url || undefined,
        country: w.country,
        countryCode: w.country_code,
        headline: w.headline,
        skills: w.skills,
        hourlyRateMin: Number(w.hourly_rate_min),
        hourlyRateMax: Number(w.hourly_rate_max),
        availabilityHours: w.availability_hours,
        availabilityType: w.availability_type,
        bio: w.bio,
        lastActive: w.last_active,
        isVerified: w.is_verified,
        reviewCount: w.review_count,
        averageRating: Number(w.average_rating),
      }));

      setWorkers(convertedWorkers);
    } catch (error) {
      console.error('Error loading workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Remote Workers</h1>
          <p className="text-muted-foreground">
            Browse skilled professionals from around the world
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 p-4 bg-card rounded-lg border border-border">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(defaultFilters)}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, skill, or keyword..."
                  className="pl-10"
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <FilterSidebar
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(defaultFilters)}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {isLoading ? 'Loading...' : `Showing ${workers.length} worker${workers.length !== 1 ? 's' : ''}`}
            </p>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : workers.length > 0 ? (
              <div className="grid gap-4">
                {workers.map(worker => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No workers found matching your criteria</p>
                <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerSearchPage;
