# LiveKit Voice Agent Platform

A frontend platform for agencies to create, manage, and deploy LiveKit voice AI agents. Users can access voice calling agents through a clean web interface.

## Features

- **User Management**: Create users and assign individual LiveKit accounts
- **Agent Management**: Create, edit, and delete voice agents with custom configurations
- **Multi-tenant**: Each user can have their own LiveKit credentials
- **Agent Assignment**: Assign specific agents to specific users
- **Voice Calling**: Real-time voice conversations with AI agents using LiveKit
- **User Portal**: Clean interface for end users to access available agents
- **Admin Dashboard**: Manage agents, users, and LiveKit configurations

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and add your LiveKit credentials:

```bash
cp .env.example .env.local
```

Get your credentials from [LiveKit Cloud](https://cloud.livekit.io):

```env
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://your-project.livekit.cloud
```

### 3. Deploy Your Agent Backend

You need a LiveKit agent running on the backend. Follow the [LiveKit Voice AI quickstart](https://docs.livekit.io/agents/quickstart/) to create and deploy your agent.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── agents/       # Agent CRUD endpoints
│   │   ├── users/        # User management + LiveKit assignment
│   │   └── token/        # LiveKit token generation
│   ├── admin/
│   │   ├── page.tsx      # Agent management
│   │   └── users/        # User management
│   └── page.tsx          # User-facing agent list
├── components/
│   ├── AgentCard.tsx     # Agent display card
│   ├── AgentForm.tsx     # Create/edit agent form
│   ├── AgentAssignModal.tsx  # Assign agents to users
│   ├── LiveKitModal.tsx  # Manage user LiveKit credentials
│   ├── Navbar.tsx        # Navigation
│   ├── UserCard.tsx      # User display card
│   ├── UserForm.tsx      # Create/edit user form
│   └── VoiceCall.tsx     # LiveKit voice call interface
├── lib/
│   ├── agents-store.ts   # Agent data store
│   ├── users-store.ts    # User data store
│   └── livekit.ts        # LiveKit token utilities
└── types/
    ├── agent.ts          # Agent types
    └── user.ts           # User types
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | List all agents |
| POST | `/api/agents` | Create new agent |
| GET | `/api/agents/[id]` | Get agent by ID |
| PUT | `/api/agents/[id]` | Update agent |
| DELETE | `/api/agents/[id]` | Delete agent |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create new user |
| GET | `/api/users/[id]` | Get user by ID |
| PUT | `/api/users/[id]` | Update user |
| DELETE | `/api/users/[id]` | Delete user |
| PUT | `/api/users/[id]/livekit` | Set user's LiveKit credentials |
| DELETE | `/api/users/[id]/livekit` | Remove user's LiveKit credentials |
| GET | `/api/users/[id]/agents` | Get user's assigned agents |
| POST | `/api/users/[id]/agents` | Assign agent to user |
| DELETE | `/api/users/[id]/agents` | Remove agent from user |
| POST | `/api/token` | Generate LiveKit token |

## Production Deployment

1. Replace the in-memory agent store with a database (PostgreSQL, MongoDB, etc.)
2. Add authentication for the admin dashboard
3. Set up proper environment variables in your hosting platform
4. Deploy your LiveKit agent backend

## Tech Stack

- Next.js 14 (App Router)
- LiveKit React SDK
- Tailwind CSS
- TypeScript
