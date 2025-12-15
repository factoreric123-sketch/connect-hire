import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { jobService } from '@/lib/database';
import { SKILLS, COUNTRIES } from '@/data/mockData';
import { ArrowLeft, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, employerProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [] as string[],
    hourlyRateMin: '',
    hourlyRateMax: '',
    availabilityHours: '',
    countryPreference: '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to post a job</h1>
          <Button onClick={() => navigate('/auth')}>Log In</Button>
        </div>
      </div>
    );
  }

  if (!employerProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Only employers can post jobs</h1>
          <Button onClick={() => navigate('/workers')}>Browse Workers</Button>
        </div>
      </div>
    );
  }

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || formData.skills.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await jobService.create({
        employer_id: employerProfile.id,
        title: formData.title,
        description: formData.description,
        skills: formData.skills,
        hourly_rate_min: formData.hourlyRateMin ? parseFloat(formData.hourlyRateMin) : 1,
        hourly_rate_max: formData.hourlyRateMax ? parseFloat(formData.hourlyRateMax) : 3,
        availability_hours: formData.availabilityHours ? parseInt(formData.availabilityHours) : 8,
        country_preference: formData.countryPreference || null,
        is_active: true,
      });

      toast.success('Job posted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
            <CardDescription>
              Fill out the details below to post your job listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Virtual Assistant for E-commerce"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={6}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Required Skills *</Label>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map(skill => (
                      <Badge key={skill} variant="default" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {SKILLS.filter(s => !formData.skills.includes(s)).map(skill => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rateMin">Min Rate ($/hr)</Label>
                  <Input
                    id="rateMin"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="1"
                    value={formData.hourlyRateMin}
                    onChange={e => setFormData({ ...formData, hourlyRateMin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateMax">Max Rate ($/hr)</Label>
                  <Input
                    id="rateMax"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="3"
                    value={formData.hourlyRateMax}
                    onChange={e => setFormData({ ...formData, hourlyRateMax: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Hours per Day Required</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="8"
                  value={formData.availabilityHours}
                  onChange={e => setFormData({ ...formData, availabilityHours: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Country Preference</Label>
                <Select
                  value={formData.countryPreference || 'all'}
                  onValueChange={v => setFormData({ ...formData, countryPreference: v === 'all' ? '' : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Open to all countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Open to all countries</SelectItem>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Job'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJobPage;
