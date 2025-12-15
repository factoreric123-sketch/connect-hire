import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import WorkerCard from "@/components/workers/WorkerCard";
import JobCard from "@/components/jobs/JobCard";
import { mockWorkers, mockJobs } from "@/data/mockData";
import { Search, Users, Briefcase, MessageSquare, Star, Globe } from "lucide-react";

const Index = () => {
  const featuredWorkers = mockWorkers.slice(0, 3);
  const recentJobs = mockJobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Connect with Global
              <span className="text-primary"> Remote Talent</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Find skilled remote workers from around the world. Browse profiles, 
              post jobs, and connect directly with talented professionals.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link to="/workers">
                  <Search className="mr-2 h-5 w-5" />
                  Find Workers
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            How ConnectWork Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Browse Profiles</h3>
              <p className="text-muted-foreground">
                Explore detailed worker profiles with skills, experience, and verified reviews.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Connect Directly</h3>
              <p className="text-muted-foreground">
                Message workers directly to discuss projects and negotiate terms.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Work Globally</h3>
              <p className="text-muted-foreground">
                Access talent from around the world with competitive hourly rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workers Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">Featured Workers</h2>
            <Button asChild variant="ghost">
              <Link to="/workers">View All →</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">Recent Job Posts</h2>
            <Button asChild variant="ghost">
              <Link to="/jobs">View All →</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Join thousands of employers and workers connecting on ConnectWork.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">ConnectWork</h3>
              <p className="text-sm text-muted-foreground">
                Connecting global talent with opportunities worldwide.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-medium text-foreground">For Workers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
                <li><Link to="/auth" className="hover:text-primary">Create Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium text-foreground">For Employers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/workers" className="hover:text-primary">Find Workers</Link></li>
                <li><Link to="/post-job" className="hover:text-primary">Post a Job</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2024 ConnectWork. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
