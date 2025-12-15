# Troubleshooting Guide

## "The app encountered an error" on /post-job page

This error typically means your Supabase environment variables are not configured.

### Solution:

1. **Check your `.env` file** in the project root:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
   ```

2. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the Project URL and anon public key

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Jobs not appearing after posting

If you see "Job posted successfully!" but the job doesn't appear:

### Possible Causes:

1. **Database tables not created**
   - Run the migrations in Supabase SQL Editor
   - Check `supabase/migrations/001_initial_schema.sql`

2. **RLS policies blocking access**
   - Verify you're logged in as an employer
   - Check Supabase → Authentication → Users
   - Verify the user_profile has user_type = 'employer'

3. **Browser console errors**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for Supabase API errors

### Debug Steps:

1. **Check browser console** (F12 → Console tab)
2. **Verify Supabase tables exist:**
   - Go to Supabase Dashboard → Database → Tables
   - Confirm `jobs` table exists
   
3. **Check data in Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - Select `jobs` table
   - See if your job was created

4. **Verify employer profile:**
   - Check `employer_profiles` table
   - Ensure your user has an employer profile with an ID

## Authentication Issues

### "Failed to load profile"

1. Check that migrations were run
2. Verify user_profiles, worker_profiles, and employer_profiles tables exist
3. Check RLS policies are enabled

### "Missing Supabase environment variables"

1. Create `.env` file in project root
2. Copy from `.env.example`
3. Add your Supabase credentials
4. Restart dev server

## General Tips

- Always check browser console for errors
- Verify Supabase tables were created
- Check that RLS policies allow your operations
- Ensure you're logged in with the correct user type
- Clear browser cache if changes don't appear
