# VoiceAgent Platform

A production-ready SaaS platform for agencies to create, manage, and monetize LiveKit voice AI agents. Provide your users with a white-label frontend to access voice calling agents.

## Features

### For Agencies
- **Multi-tenant User Management**: Create users, assign LiveKit accounts, manage billing
- **Agent Configuration**: Full control over prompts, voice, LLM, webhooks, MCP servers
- **Analytics Dashboard**: Real-time metrics, call history, cost tracking
- **Phone Number Management**: Assign phone numbers for inbound calls
- **Outbound Calling**: Initiate calls to customers via SIP trunks
- **API Keys**: Provide users with API access to your platform
- **Billing & Plans**: Track usage, set limits, manage subscriptions

### Agent Configuration
- **Prompts**: System prompt, first message, fallback, end call, transfer messages
- **Voice**: OpenAI, ElevenLabs, Deepgram, PlayHT with speed/pitch controls
- **LLM**: OpenAI, Anthropic, Groq, Together AI with temperature/token settings
- **Advanced**: Interruption threshold, silence timeout, call recording, VAD
- **Webhooks**: Real-time notifications for call events
- **MCP Servers**: Connect external tools via Model Context Protocol
- **Phone Numbers**: Twilio, Vonage, Telnyx, Plivo integration

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
# Edit .env.local with your LiveKit credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

See `.env.example` for all available configuration options.

Required variables:
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
│   │   ├── health/         # Health check endpoint
│   │   ├── outbound-calls/ # Outbound calling
│   │   ├── phone-numbers/  # Phone number management
│   │   ├── sip-trunks/     # SIP trunk configuration
│   │   ├── token/          # LiveKit token generation
│   │   └── users/          # User management
│   ├── agents/             # Agent management page
│   ├── calls/              # Call history page
│   ├── dashboard/          # Analytics dashboard
│   ├── outbound/           # Outbound calls page
│   ├── phone-numbers/      # Phone numbers page
│   ├── settings/           # Platform settings
│   ├── users/              # User management page
│   └── page.tsx            # Voice call interface
├── components/
│   ├── AgentCard.tsx
│   ├── AgentConfig.tsx     # Full agent configuration
│   ├── AgentForm.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── CallHistory.tsx
│   ├── ErrorBoundary.tsx   # Error handling
│   ├── LoadingSkeleton.tsx # Loading states
│   ├── Navbar.tsx
│   ├── Toast.tsx           # Notifications
│   ├── UserCard.tsx
│   ├── UserForm.tsx
│   └── VoiceCall.tsx
├── lib/
│   ├── agents-store.ts
│   ├── analytics-store.ts
│   ├── api-utils.ts        # API response helpers
│   ├── db.ts               # Database abstraction
│   ├── env.ts              # Environment validation
│   ├── hooks.ts            # React hooks
│   ├── livekit.ts
│   ├── telephony-store.ts
│   └── users-store.ts
└── types/
    ├── agent.ts
    ├── analytics.ts
    ├── telephony.ts
    └── user.ts
```

## API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with env validation |

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

### Telephony
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sip-trunks` | List SIP trunks |
| POST | `/api/sip-trunks` | Create SIP trunk |
| GET | `/api/phone-numbers` | List phone numbers |
| POST | `/api/phone-numbers` | Add phone number |
| GET | `/api/outbound-calls` | List outbound calls |
| POST | `/api/outbound-calls` | Initiate outbound call |

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

### Prerequisites
1. LiveKit Cloud account or self-hosted LiveKit server
2. Node.js 18+ runtime
3. (Optional) PostgreSQL or MongoDB for persistent storage
4. (Optional) Redis for rate limiting and caching

### Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Deploy to your preferred platform**:
   - Vercel: `vercel deploy`
   - Docker: Use the included Dockerfile
   - AWS/GCP/Azure: Deploy as a Node.js application

### Production Checklist

- [ ] Replace in-memory stores with a database (PostgreSQL, MongoDB)
- [ ] Add authentication (NextAuth, Clerk, Auth0)
- [ ] Integrate payment provider (Stripe)
- [ ] Deploy LiveKit agent backend
- [ ] Configure telephony provider (Twilio, Vonage, Telnyx)
- [ ] Set up monitoring and alerting (Sentry, DataDog)
- [ ] Configure CORS and security headers
- [ ] Enable rate limiting with Redis
- [ ] Set up SSL/TLS certificates
- [ ] Configure CDN for static assets

### Database Migration

The app uses an in-memory store by default. To migrate to a real database:

1. Install your preferred ORM (Prisma, Drizzle, etc.)
2. Update `src/lib/db.ts` with database connection
3. Replace store functions in `*-store.ts` files with database queries

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Voice**: LiveKit React SDK
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## License

MIT
