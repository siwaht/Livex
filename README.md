# VoiceAgent Platform

A production-ready SaaS platform for agencies to create, manage, and monetize LiveKit voice AI agents. Provide your users with a white-label frontend to access voice calling agents.

## Features

### For Agencies
- **Multi-tenant User Management**: Create users, assign LiveKit accounts, manage billing
- **Agent Configuration**: Full control over prompts, voice, LLM, webhooks, MCP servers
- **Analytics Dashboard**: Real-time metrics, call history, cost tracking
- **Phone Number Management**: Assign phone numbers for inbound calls
- **API Keys**: Provide users with API access to your platform
- **Billing & Plans**: Track usage, set limits, manage subscriptions

### Agent Configuration
- **Prompts**: System prompt, first message, fallback, end call, transfer messages
- **Voice**: OpenAI, ElevenLabs, Deepgram, PlayHT with speed/pitch controls
- **LLM**: OpenAI, Anthropic, Groq, Together AI with temperature/token settings
- **Advanced**: Interruption threshold, silence timeout, call recording, VAD
- **Webhooks**: Real-time notifications for call events
- **MCP Servers**: Connect external tools via Model Context Protocol
- **Phone Numbers**: Twilio, Vonage, Telnyx integration

### Analytics
- Total calls, minutes, cost tracking
- Success rate and latency metrics
- Per-agent performance breakdown
- Sentiment analysis
- Daily/weekly/monthly trends

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run development server
npm run dev
```

## Environment Variables

```env
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://your-project.livekit.cloud
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── agents/         # Agent CRUD
│   │   ├── analytics/      # Analytics endpoints
│   │   ├── token/          # LiveKit token generation
│   │   └── users/          # User management
│   ├── agents/             # Agent management page
│   ├── calls/              # Call history page
│   ├── dashboard/          # Analytics dashboard
│   ├── settings/           # Platform settings
│   ├── users/              # User management page
│   └── page.tsx            # Voice call interface
├── components/
│   ├── AgentCard.tsx
│   ├── AgentConfig.tsx     # Full agent configuration
│   ├── AgentForm.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── CallHistory.tsx
│   ├── Navbar.tsx
│   ├── UserCard.tsx
│   ├── UserForm.tsx
│   └── VoiceCall.tsx
├── lib/
│   ├── agents-store.ts
│   ├── analytics-store.ts
│   ├── livekit.ts
│   └── users-store.ts
└── types/
    ├── agent.ts
    ├── analytics.ts
    └── user.ts
```

## API Endpoints

### Agents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | List all agents |
| POST | `/api/agents` | Create agent |
| GET | `/api/agents/[id]` | Get agent |
| PUT | `/api/agents/[id]` | Update agent |
| DELETE | `/api/agents/[id]` | Delete agent |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/[id]` | Update user |
| DELETE | `/api/users/[id]` | Delete user |
| PUT | `/api/users/[id]/livekit` | Set LiveKit credentials |
| POST | `/api/users/[id]/agents` | Assign agent |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get analytics summary |
| GET | `/api/analytics/calls` | Get call history |

### Token
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token` | Generate LiveKit token |

## Production Deployment

1. Replace in-memory stores with a database (PostgreSQL, MongoDB)
2. Add authentication (NextAuth, Clerk, Auth0)
3. Integrate payment provider (Stripe)
4. Deploy LiveKit agent backend
5. Configure telephony provider (Twilio, Vonage, Telnyx)
6. Set up monitoring and alerting

## Tech Stack

- Next.js 14 (App Router)
- LiveKit React SDK
- Tailwind CSS
- TypeScript
- Lucide Icons
