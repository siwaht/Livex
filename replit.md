# LiveKit Voice Agent Platform

## Overview
A frontend platform for agencies to create, manage, and deploy LiveKit voice AI agents. Users can access voice calling agents through a clean web interface.

## Project Architecture
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Voice SDK**: LiveKit React SDK

### Directory Structure
```
src/
├── app/            # Next.js App Router pages and API routes
│   ├── api/        # API endpoints (agents, users, token)
│   ├── admin/      # Admin dashboard pages
│   └── page.tsx    # User-facing agent list
├── components/     # React components
├── lib/            # Utility functions and data stores
└── types/          # TypeScript type definitions
```

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Production**: `npm run start`

## Environment Variables
The following environment variables may be needed for LiveKit functionality:
- `LIVEKIT_API_KEY` - LiveKit API key
- `LIVEKIT_API_SECRET` - LiveKit API secret
- `LIVEKIT_URL` - LiveKit server URL (e.g., wss://your-project.livekit.cloud)

## Recent Changes
- 2026-01-06: Initial import and Replit environment setup
  - Configured Next.js to run on port 5000
  - Added allowedDevOrigins for Replit proxy compatibility
  - Set up deployment configuration
