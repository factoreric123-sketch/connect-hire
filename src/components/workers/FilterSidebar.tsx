import React from 'react';
import { FilterState } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { COUNTRIES, SKILLS } from '@/data/mockData';
import { X, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange, onReset }) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    updateFilter('skills', newSkills);
  };

  const hasActiveFilters = 
    filters.country !== '' ||
    filters.minRate > 0 ||
    filters.maxRate < 10 ||
    filters.minHours > 0 ||
    filters.maxHours < 12 ||
    filters.verifiedOnly ||
    filters.lastActive !== 'any' ||
    filters.skills.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label>Country</Label>
        <Select value={filters.country} onValueChange={v => updateFilter('country', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any country</SelectItem>
            {COUNTRIES.map(country => (
              <SelectItem key={country.code} value={country.code}>
                {country.flag} {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hourly Rate */}
      <div className="space-y-3">
        <Label>Hourly Rate: ${filters.minRate} - ${filters.maxRate}</Label>
        <Slider
          value={[filters.minRate, filters.maxRate]}
          onValueChange={([min, max]) => {
            updateFilter('minRate', min);
            updateFilter('maxRate', max);
          }}
          min={0}
          max={10}
          step={0.5}
          className="py-2"
        />
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label>Availability: {filters.minHours} - {filters.maxHours} hrs/day</Label>
        <Slider
          value={[filters.minHours, filters.maxHours]}
          onValueChange={([min, max]) => {
            updateFilter('minHours', min);
            updateFilter('maxHours', max);
          }}
          min={0}
          max={12}
          step={1}
          className="py-2"
        />
      </div>

      {/* Last Active */}
      <div className="space-y-2">
        <Label>Last Active</Label>
        <Select value={filters.lastActive} onValueChange={v => updateFilter('lastActive', v as FilterState['lastActive'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Verified Only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified"
          checked={filters.verifiedOnly}
          onCheckedChange={checked => updateFilter('verifiedOnly', !!checked)}
        />
        <Label htmlFor="verified" className="text-sm cursor-pointer">
          Verified workers only
        </Label>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label>Skills</Label>
        {filters.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {filters.skills.map(skill => (
              <Badge key={skill} variant="default" className="text-xs cursor-pointer" onClick={() => toggleSkill(skill)}>
                {skill}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
          {SKILLS.filter(s => !filters.skills.includes(s)).map(skill => (
            <Badge
              key={skill}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-secondary"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
