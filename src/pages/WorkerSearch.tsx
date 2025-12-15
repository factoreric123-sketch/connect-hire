import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import WorkerCard from '@/components/workers/WorkerCard';
import FilterSidebar from '@/components/workers/FilterSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { mockWorkers } from '@/data/mockData';
import { FilterState } from '@/types';
import { Search, SlidersHorizontal } from 'lucide-react';

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

  const filteredWorkers = useMemo(() => {
    return mockWorkers.filter(worker => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          worker.name.toLowerCase().includes(searchLower) ||
          worker.headline.toLowerCase().includes(searchLower) ||
          worker.skills.some(s => s.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Country
      if (filters.country && filters.country !== 'all' && worker.countryCode !== filters.country) return false;

      // Rate
      if (worker.hourlyRateMin > filters.maxRate || worker.hourlyRateMax < filters.minRate) return false;

      // Hours
      if (worker.availabilityHours < filters.minHours || worker.availabilityHours > filters.maxHours) return false;

      // Verified
      if (filters.verifiedOnly && !worker.isVerified) return false;

      // Last active
      if (filters.lastActive !== 'any') {
        const lastActive = new Date(worker.lastActive).getTime();
        const now = Date.now();
        if (filters.lastActive === 'today' && now - lastActive > 24 * 60 * 60 * 1000) return false;
        if (filters.lastActive === 'week' && now - lastActive > 7 * 24 * 60 * 60 * 1000) return false;
        if (filters.lastActive === 'month' && now - lastActive > 30 * 24 * 60 * 60 * 1000) return false;
      }

      // Skills
      if (filters.skills.length > 0) {
        const hasSkill = filters.skills.some(skill => worker.skills.includes(skill));
        if (!hasSkill) return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Remote Workers</h1>
          <p className="text-muted-foreground">
            Browse {mockWorkers.length}+ skilled professionals from around the world
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
              Showing {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''}
            </p>

            {/* Results Grid */}
            {filteredWorkers.length > 0 ? (
              <div className="grid gap-4">
                {filteredWorkers.map(worker => (
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
