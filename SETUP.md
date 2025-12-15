# ConnectWork Platform Setup Guide

This guide will help you set up and run the ConnectWork platform - a connector platform for linking employers with remote workers.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git

## 1. Supabase Setup

### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or log in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `connectwork` (or your preferred name)
   - Database Password: Create a strong password (save it securely)
   - Region: Choose the closest to your users
5. Click "Create new project" and wait for the project to be ready

### Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - Project URL (starts with `https://`)
   - `anon` `public` key (this is your publishable key)

### Update Environment Variables

1. In your project root, open the `.env` file
2. Update the following variables with your Supabase values:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
```

## 2. Database Migration

### Run the Migrations

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration
6. Repeat for `supabase/migrations/002_storage_setup.sql`

Alternatively, if you have the Supabase CLI installed:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your_project_id

# Run migrations
supabase db push
```

### Verify Database Setup

1. Go to **Database** > **Tables** in your Supabase dashboard
2. You should see the following tables:
   - `user_profiles`
   - `worker_profiles`
   - `employer_profiles`
   - `jobs`
   - `reviews`
   - `conversations`
   - `messages`
   - `saved_workers`

## 3. Storage Setup

### Verify Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. You should see an `avatars` bucket
3. The bucket should be public (for viewing profile pictures)

If the bucket doesn't exist:
1. Click "Create a new bucket"
2. Name it `avatars`
3. Check "Public bucket"
4. Click "Create bucket"

## 4. Application Setup

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 5. Test the Application

### Create Test Accounts

1. **Create a Worker Account:**
   - Go to the app
   - Click "Sign up"
   - Select "I'm a Worker"
   - Enter your details
   - Check your email for verification (if enabled)

2. **Create an Employer Account:**
   - Log out
   - Click "Sign up"
   - Select "I'm Hiring"
   - Enter your company details
   - Check your email for verification (if enabled)

### Test Core Features

1. **Worker Features:**
   - Complete your profile with skills and rates
   - Upload a profile picture
   - Browse jobs
   - Express interest in jobs
   - Send messages to employers

2. **Employer Features:**
   - Complete your company profile
   - Post a job listing
   - Search for workers by skills, country, rate
   - Save worker profiles
   - Send messages to workers

3. **Messaging:**
   - Start a conversation from a worker or job profile
   - Send and receive messages in real-time
   - Multiple conversations should work independently

## 6. Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting

The app can be deployed to any static hosting service:

- **Vercel:** Connect your Git repository and deploy
- **Netlify:** Connect your Git repository and deploy
- **Cloudflare Pages:** Connect your Git repository and deploy

### Environment Variables in Production

Make sure to add your environment variables to your hosting platform:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
```

## 7. Seeding Data (Optional)

For testing purposes, you may want to create some sample workers and jobs. You can do this by:

1. Creating multiple test accounts
2. Filling out profiles with different skills, countries, and rates
3. Posting various job listings

Or use the SQL Editor to insert sample data directly.

## Troubleshooting

### Issue: "Missing Supabase environment variables"

- Solution: Make sure your `.env` file is in the project root and contains all required variables

### Issue: Database tables not found

- Solution: Run the migrations again in the SQL Editor

### Issue: Cannot upload profile pictures

- Solution: Check that the `avatars` storage bucket exists and is public

### Issue: Real-time messaging not working

- Solution: Check that your Supabase project has Realtime enabled (it should be by default)

### Issue: Email verification not working

- Solution: In Supabase dashboard, go to **Authentication** > **Settings** and configure your email provider

## Security Considerations

1. **Row Level Security (RLS):** All tables have RLS enabled with appropriate policies
2. **API Keys:** The publishable key is safe to expose in your frontend
3. **Authentication:** Supabase handles secure authentication with JWT tokens
4. **Data Privacy:** Users can only access their own data and public profiles

## Performance at Scale

The platform is designed to handle high volumes:

1. **Database Indexes:** All frequently queried columns are indexed
2. **Pagination:** Worker and job listings support pagination
3. **Caching:** Profile pictures are cached with CDN
4. **Real-time:** Supabase Realtime handles messaging efficiently

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Review the React documentation: https://react.dev
- Check the Vite documentation: https://vitejs.dev

## License

This platform is provided as-is for connecting employers with workers. All work arrangements happen off-platform between parties.
