# ConnectWork - Remote Worker Connector Platform

A modern, scalable platform for connecting employers with remote workers for simple, repeatable virtual tasks.

## Overview

ConnectWork is a **connector-only platform** that facilitates discovery and communication between employers and remote workers. The platform does not handle payments, contracts, or employment - it exists solely to help people find each other and connect.

### Key Features

- **For Workers:**
  - Create detailed profiles with skills, availability, and preferred rates
  - Browse job opportunities from employers worldwide
  - Message employers directly about opportunities
  - Build reputation through verified reviews
  - Upload profile pictures

- **For Employers:**
  - Search and filter workers by country, skills, availability, and rate
  - Post job listings with detailed requirements
  - Save interesting worker profiles for later
  - Message workers directly to discuss projects
  - View worker reviews and ratings

- **Core Functionality:**
  - Real-time messaging between employers and workers
  - Advanced search and filtering
  - Responsive design for all devices
  - Fast, scalable architecture
  - Secure authentication and data privacy

## Technology Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI Framework:** Tailwind CSS + shadcn/ui components
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **State Management:** React Context + TanStack Query
- **Routing:** React Router v6
- **Form Handling:** React Hook Form + Zod validation

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and fill in your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
/workspace
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── workers/       # Worker-related components
│   │   ├── jobs/          # Job-related components
│   │   ├── reviews/       # Review components
│   │   └── layout/        # Layout components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   │   ├── database.ts    # Database service layer
│   │   ├── database.types.ts  # TypeScript types
│   │   ├── storage.ts     # File storage utilities
│   │   └── validation.ts  # Form validation
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Landing page
│   │   ├── Auth.tsx       # Authentication
│   │   ├── Dashboard.tsx  # User dashboard
│   │   ├── WorkerSearch.tsx  # Browse workers
│   │   ├── WorkerProfile.tsx # Worker profile view
│   │   ├── JobBoard.tsx   # Browse jobs
│   │   ├── JobDetail.tsx  # Job detail view
│   │   ├── PostJob.tsx    # Create job listing
│   │   └── Messages.tsx   # Messaging interface
│   ├── types/             # TypeScript type definitions
│   └── integrations/      # Third-party integrations
│       └── supabase/      # Supabase client
├── supabase/
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── ...config files
```

## Database Schema

The platform uses PostgreSQL with the following main tables:

- `user_profiles` - User accounts (extends Supabase auth)
- `worker_profiles` - Worker profile data
- `employer_profiles` - Employer profile data
- `jobs` - Job listings
- `reviews` - Worker reviews
- `conversations` - Message conversations
- `messages` - Individual messages
- `saved_workers` - Saved/bookmarked workers

All tables have Row Level Security (RLS) enabled for data privacy.

## Key Design Principles

1. **Neutral Connection Layer:** The platform facilitates connections but doesn't interfere with work arrangements
2. **Low Friction:** Simple signup, easy profile creation, instant messaging
3. **Fast Discovery:** Advanced filtering and search to find matches quickly
4. **Transparency:** Clear information about skills, rates, and availability
5. **Scalability:** Built to handle high volumes with proper indexing and pagination
6. **Privacy:** Users control their data with secure authentication

## Development

```bash
# Run linter
npm run lint

# Build for development (with source maps)
npm run build:dev

# Preview production build
npm run preview
```

## Deployment

The application is designed to be deployed as a static site to any hosting platform:

- Vercel (recommended)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static hosting service

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
```

## Features for Scale

- **Database Indexing:** All frequently queried columns are indexed
- **Pagination:** Built-in pagination for large datasets
- **Real-time Updates:** Efficient message delivery using Supabase Realtime
- **CDN Caching:** Profile images cached via Supabase CDN
- **Optimistic Updates:** UI updates before server confirmation
- **Query Optimization:** Efficient SQL queries with proper joins

## Important Notes

1. **No Payment Processing:** The platform does not handle money or transactions
2. **No Contract Management:** All agreements are between employer and worker
3. **No Work Tracking:** Hours, deliverables, and completion are off-platform
4. **No Dispute Resolution:** Parties resolve issues directly
5. **Connection Only:** The platform's role ends when parties connect

## Security

- Row Level Security (RLS) on all database tables
- Secure authentication via Supabase Auth
- JWT-based session management
- Input validation and sanitization
- Protected API routes
- CORS configuration
- Rate limiting (via Supabase)

## License

MIT License - See LICENSE file for details

## Contributing

This is a demonstration project. For production use, please review and customize according to your needs.

## Support

For setup help, see [SETUP.md](./SETUP.md)

## Roadmap Ideas

- Email notifications for new messages
- Worker portfolio/samples
- Advanced search filters
- Video profiles
- Skill verification badges
- Multi-language support
- Mobile apps (React Native)
- Analytics dashboard

---

**Remember:** ConnectWork is a connector platform. All work arrangements, payments, and agreements happen off-platform between the two parties directly.
