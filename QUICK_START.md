# Quick Start Guide - ConnectWork Platform

Get your ConnectWork platform up and running in 5 steps!

## Step 1: Create a Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - Name: `connectwork`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Click **"Create new project"** and wait ~2 minutes

## Step 2: Set Up Database (3 minutes)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open `/workspace/supabase/migrations/001_initial_schema.sql` in your code editor
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"** - you should see "Success"
6. Repeat for `002_storage_setup.sql`

## Step 3: Get Your API Keys (1 minute)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with https://)
   - **anon public** key (the long string)

## Step 4: Configure Environment (1 minute)

1. Open `/workspace/.env` in your code editor
2. Replace the values with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID=abc123xyz
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...your-key-here
```

## Step 5: Start the App (1 minute)

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser

## First Test - Create Accounts

### Test as a Worker
1. Click **"Sign up"**
2. Select **"I'm a Worker"**
3. Enter:
   - Full Name: `Test Worker`
   - Email: `worker@test.com`
   - Password: `test123`
4. Click **"Create Account"**
5. Go to **Dashboard** and complete your profile

### Test as an Employer (Open Incognito Window)
1. Click **"Sign up"**
2. Select **"I'm Hiring"**
3. Enter:
   - Company Name: `Test Company`
   - Email: `employer@test.com`
   - Password: `test123`
4. Click **"Create Account"**
5. Post a job or search for workers

## Verify Everything Works

✅ **Authentication:**
- Can sign up as worker
- Can sign up as employer
- Can log in and out

✅ **Worker Features:**
- Complete profile with skills
- Upload profile picture
- Browse jobs
- Send message to employer

✅ **Employer Features:**
- Search workers with filters
- Save worker profiles
- Post a job listing
- Send message to worker

✅ **Messaging:**
- Start conversation
- Send messages
- Receive messages in real-time

## Common Issues

### "Missing Supabase environment variables"
- Check your `.env` file has correct values
- Restart the dev server after changing `.env`

### "Failed to load workers/jobs"
- Make sure you ran both migration files
- Check Supabase dashboard → Database → Tables

### "Cannot upload avatar"
- Verify the `avatars` bucket exists in Supabase Storage
- Check it's set to "Public"

## Next Steps

1. **Customize branding** - Update colors in `tailwind.config.ts`
2. **Add more skills** - Edit `SKILLS` array in `src/data/mockData.ts`
3. **Add countries** - Edit `COUNTRIES` array in `src/data/mockData.ts`
4. **Enable email auth** - Configure in Supabase Auth settings
5. **Deploy** - Push to Vercel/Netlify/Cloudflare Pages

## Need Help?

- 📖 Read [SETUP.md](./SETUP.md) for detailed instructions
- 📋 Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for features
- 💬 Review code comments for implementation details

## Production Deployment

When ready to deploy:

```bash
# Build for production
npm run build

# The dist/ folder can be deployed to any static host
```

Remember to set environment variables in your hosting platform!

---

**You're all set!** 🎉 Your ConnectWork platform is ready to connect employers with remote workers.
