# Supabase Configuration for ConnectWork

## Disable Email Confirmation (Recommended for Development)

To remove the "wait 39 seconds" rate limiting message and allow instant signups:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings** → **Auth Providers**
3. Scroll down to **Email Auth**
4. **Disable "Confirm email"** toggle
5. Click **Save**

This allows users to sign up and log in immediately without email verification.

## Alternative: Configure Email Provider (For Production)

If you want to keep email confirmation enabled:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your email provider (SendGrid, Mailgun, AWS SES, etc.)
3. Enable email templates
4. Customize the confirmation email

## Production Recommendation

For production, you should:
- ✅ Enable email confirmation
- ✅ Configure a proper SMTP provider
- ✅ Customize email templates with your branding
- ✅ Set appropriate rate limits

For development/testing:
- ✅ Disable email confirmation for faster testing
- ✅ Re-enable before production deployment

## Current Setup

The app is configured to work with or without email confirmation. If confirmation is disabled in Supabase, users will be logged in immediately after signup.
