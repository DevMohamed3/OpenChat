<div align="center">

# ZeroZone

**A production-grade real-time chat and voice communication platform.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-0zone.site-2ea44f?style=for-the-badge)](https://0zone.site)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen.svg?style=for-the-badge)]()

[Live Demo](https://0zone.site) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## Preview

<!--
  Add a screenshot or short GIF here once ready. Example:
  ![ZeroZone chat interface](./docs/screenshot-chat.png)
  ![ZeroZone demo](./docs/demo.gif)
-->
> Screenshots/GIF coming soon — check the [live demo](https://0zone.site) in the meantime.

---

## Table of Contents

- [Overview](#overview)
- [Why This Project Exists](#why-this-project-exists)
- [Technical Architecture](#technical-architecture)
- [Real-Time System](#real-time-system)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Deployment Considerations](#deployment-considerations)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Common Challenges Solved](#common-challenges-solved)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ZeroZone is not a basic chat demo. It models a Discord-like communication platform with:

- **Real-time messaging** with instant delivery, typing indicators, and read receipts over WebSocket connections
- **Voice communication** powered by **LiveKit**, supporting both direct calls and group voice channels
- **Call persistence and recovery** ensuring users can refresh their page mid-call and automatically reconnect
- **Community organization** via Zones (servers), which contain private channels (text/voice) and participants
- **Complete authentication** with secure JWT cookies, Google OAuth integration, and email verification
- **Responsive, production-ready UI** built with Next.js, React, and Tailwind CSS

The project is structured as a monorepo using pnpm workspaces, cleanly separating frontend, backend, and shared packages.

## Why This Project Exists

This project demonstrates how to build real-time systems that handle the common challenges of production environments:

1. **Managing concurrent connections at scale** — Socket.io connections are pooled, presence tracked with heartbeats, and stale connections cleaned automatically
2. **Voice call state persistence** — Calls are tracked server-side in memory, enabling reconnection after page refreshes or temporary disconnections
3. **Graceful degradation** — Network drops trigger a grace period before call termination, allowing temporary connectivity issues to self-recover
4. **Synchronization without conflicts** — Real-time updates are coordinated via a single source of truth on the backend, preventing inconsistent state
5. **User presence and status** — Online/offline states are propagated to friends only, reducing unnecessary broadcasts

This is valuable for teams building chat applications, collaboration tools, or any system requiring reliable real-time communication.

## Technical Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                    │
│  - React components with Zustand state management          │
│  - Socket.io client for real-time subscriptions            │
│  - LiveKit client SDK for voice calls and voice channels   │
└──────────────┬──────────────────────────────────────────────┘
               │
         (HTTP + WebSocket)
               │
┌──────────────▼──────────────────────────────────────────────┐
│              Backend (Express + Socket.io)                  │
│  - RESTful API for stateless operations (auth, CRUD)       │
│  - Socket.io namespace handlers for real-time events       │
│  - LiveKit server SDK for room/token management             │
│  - In-memory structures for calls, presence, connections   │
│  - Prisma ORM for data persistence                         │
└──────────────┬──────────────────────────────────────────────┘
               │
         (SQL Protocol)
               │
┌──────────────▼──────────────────────────────────────────────┐
│           PostgreSQL Database                               │
│  - Users, messages, channels, zones, relationships          │
│  - Indexed message queries by chat and timestamp            │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

The database uses Prisma ORM with the following key entities:

- **User**: Core identity with authentication tokens, OAuth integrations, online status
- **Chat**: Containers for messages (can be DM or ZONE type)
- **Channel**: Text or voice channels within a Chat (zone)
- **Message**: Individual messages with optional file attachments, reactions, and replies
- **ChatParticipant**: Membership relationship with role-based access (OWNER, ADMIN, MEMBER)
- **ChatInvite**: Reusable invite codes for zones with expiration and usage limits
- **Friend**: Bidirectional friend relationships
- **FriendRequest**: Pending friend connections
- **MessageReaction**: Emoji reactions to messages

## Real-Time System

### Messaging Flow

1. **Connection Establishment**
   - Client connects to Socket.io server with JWT token
   - Backend validates token via middleware (`socketAuth`)
   - User joins personal room (`user:${userId}`) and all chat rooms for their conversations
   - Backend registers connection and broadcasts online status to friends

2. **Sending a Message**
   - Client emits `message:send` with text/file content and target chat ID
   - Backend validates sender membership in the chat
   - Message is persisted to PostgreSQL
   - Backend broadcasts via Socket.io to all participants in the chat room
   - Frontend receives update and appends to message list

3. **Typing Indicators**
   - Client emits `typing:start` when user begins typing
   - Backend broadcasts to other participants in the chat
   - Frontend displays visual indicator
   - Timeout clears indicator after inactivity

4. **Read Status**
   - Presence updates inform others when a user is viewing a chat

### Voice Calls with LiveKit

Voice communication is handled by **LiveKit**, which manages the WebRTC media transport, room/track management, and connection quality — removing the need to hand-roll signaling and ICE negotiation.

1. **Call Initiation**
   - Caller (A) emits `call:user` to target user (B) via Socket.io
   - Backend creates an `ActiveCall` entry in the `activeCalls` map with status `"ringing"` and provisions a LiveKit room
   - Backend generates a LiveKit access token for both participants and emits `call:incoming` to B's socket room

2. **Call Acceptance**
   - Receiver (B) emits `call:accept`
   - Backend updates call status to `"active"`
   - Both clients connect to the LiveKit room using their access tokens

3. **Media Connection**
   - Both clients use the LiveKit client SDK to publish/subscribe to audio tracks
   - LiveKit handles the underlying WebRTC connection, ICE negotiation, and adaptive bitrate

4. **Call Termination**
   - Either side emits `call:end`
   - Backend removes the call from `activeCalls`, disconnects participants from the LiveKit room, and emits a termination event to the other side

### Reconnection and Persistence

The most critical feature: **calls survive page refreshes**.

**Server-Side State:**
- `activeCalls` Map maintains all ongoing calls with participant metadata and the associated LiveKit room
- `userToCall` Map tracks which call each user is currently in
- `userConnections` Map tracks active socket IDs per user with heartbeat timestamps

**Client-Side Reconnection:**
1. User is in a call and refreshes the page
2. New socket connects and authenticates
3. Frontend immediately emits `call:check`
4. Backend looks up the user in `userToCall` and returns the current call state, including a fresh LiveKit token
5. Frontend re-mounts the call component with the call data
6. Frontend rejoins the LiveKit room using the new token

**Graceful Disconnection Handling:**
- When a participant disconnects, backend starts a grace-period timer (`DISCONNECT_TIMEOUT`)
- If the user reconnects within the window, the call resumes
- After the timeout, the call is terminated and the other party is notified
- This allows temporary network blips to self-recover without interrupting calls

### Presence and Online Status

**Presence Tracking:**
- Each socket connection is registered in `userConnections` with a timestamp
- A presence cleanup interval checks periodically for stale connections
- When a user's last socket disconnects, their `isOnline` status is set to `false` in the database

**Heartbeat Mechanism:**
- Clients emit `presence:heartbeat` periodically to keep their connection timestamp fresh
- Backend updates the timestamp without broadcasting (lower overhead than on-every-event)
- Any socket event also refreshes the connection timestamp via `socket.onAny()`

**Friend State Propagation:**
- When a user goes online/offline, backend queries their friend list
- Updates are broadcast only to friends' sockets, reducing message volume
- Prevents broadcasting online status to non-friends

## Frontend Architecture

### Technology Stack

- **Next.js 16** with App Router and Turbopack for fast builds
- **React 19** with modern hooks and concurrent rendering
- **Zustand** for global state management (calls, user data, UI state)
- **Tailwind CSS** with custom configuration for consistent styling
- **shadcn/ui** for accessible, composable UI components
- **Framer Motion** for smooth animations on modals, overlays, and transitions
- **Socket.io Client** for real-time subscriptions
- **LiveKit Client SDK** for voice call media
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for forms

### Key Features

- **Responsive Design**: Adapts from mobile to desktop
- **Floating Call Overlay**: Users can continue chatting while in a call
- **Real-Time Updates**: Messages, typing indicators, and user status update instantly
- **OAuth Integration**: Sign in with Google (via AuthProvider wrapper)
- **Dark Mode**: Thread-safe with next-themes

## Backend Architecture

### Technology Stack

- **Express 5** for HTTP routing and middleware
- **Socket.io 4** for real-time WebSocket communication
- **LiveKit Server SDK** for room provisioning and access token generation
- **Prisma ORM** for database abstraction and type safety
- **PostgreSQL** as the primary data store
- **JWT + HTTP-Only Cookies** for authentication
- **bcrypt/bcryptjs** for password hashing
- **google-auth-library** for OAuth token validation

### Core Modules

**Socket Handlers** (`src/socket/`):
- `auth.ts` — Middleware that validates JWT from cookies on socket connection
- `presence.ts` — Tracks online users, manages heartbeat cleanup, broadcasts online/offline events
- `callHandler.ts` — Manages direct calls, including LiveKit room/token provisioning and reconnection logic
- `channelCallHandler.ts` — Manages group voice channels via LiveKit
- `privateChat.ts` — Handles DM messages, typing indicators, read receipts

**Controllers** (`src/controllers/`):
- Auth, User, Chat, Friend, Zones — REST endpoints for CRUD operations
- Each validates permissions and delegates to Prisma queries

**Validation** (`src/validations/`):
- Zod schemas for input validation on REST endpoints
- Prevents invalid data from entering the database

**Middleware** (`src/middlewares/`):
- `auth.middleware.ts` — Validates JWT in HTTP requests
- `requireVerified.ts` — Ensures user has verified their email
- `upload.middleware.ts` — Handles file uploads (avatars, message attachments)

## Deployment Considerations

### Production Checklist

1. **Environment Variables**
   - Set `DATABASE_URL` to production PostgreSQL instance
   - Use strong `JWT_SECRET` (>32 characters)
   - Configure `ZEROZONE_ALLOWED_ORIGINS` for your domain(s)
   - Set LiveKit credentials (`LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`)
   - Enable SSL/TLS on database connection

2. **Socket.io Scaling**
   - The current setup uses in-memory maps for `activeCalls`, `userConnections`, `userToCall`
   - For single-server deployments, this is fine
   - For multi-server deployments, migrate to:
     - Redis adapter for Socket.io (broadcasts across servers)
     - Shared cache (Redis) for `activeCalls` instead of in-memory
     - Session affinity or a shared session store

3. **Database Optimization**
   - Most queries are indexed by `chatId` and `createdAt` for message retrieval
   - Consider query result caching for zones and channels

4. **Security Hardening**
   - Rate limit authentication endpoints
   - Validate file uploads (MIME type, size)
   - Sanitize message content before storage (if needed)
   - Implement CORS correctly for your domain
   - Use HTTPS/WSS only in production

## Project Structure

```
zerozone/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── socket/           # Socket.io event handlers
│   │   │   ├── controllers/      # REST endpoint handlers
│   │   │   ├── middlewares/      # Express middleware
│   │   │   ├── routes/           # Route definitions
│   │   │   ├── validations/      # Zod schemas
│   │   │   ├── utils/            # Utilities (JWT, crypto, etc)
│   │   │   ├── services/         # Business logic (incl. LiveKit token/room provisioning)
│   │   │   ├── config/           # Configuration (env, prisma, CORS)
│   │   │   ├── app.ts            # Express app setup
│   │   │   └── index.ts          # Server entry, Socket.io setup
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Database schema
│   │   │   └── migrations/       # Prisma migrations
│   │   └── package.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages
│   │   │   ├── components/       # React components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utilities and API clients
│   │   │   ├── features/         # Feature-specific logic
│   │   │   └── globals.css       # Global styles
│   │   └── package.json
│   └── desktop/                  # Electron app (optional)
├── packages/
│   ├── components/                # Shared shadcn/ui components
│   ├── lib/                       # Shared utilities and types
│   ├── types/                     # TypeScript type definitions
│   └── package.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x
- PostgreSQL instance
- A LiveKit project (self-hosted or [LiveKit Cloud](https://livekit.io)) with API key/secret

### Quick Start

1. **Clone and Install**

```bash
git clone https://github.com/DevMuhammed3/ZeroZone
cd zerozone
pnpm install
```

2. **Configure Environment**

Create `apps/backend/.env`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/zerozone
JWT_SECRET=your-secret-key-at-least-32-characters
PORT=4000
BASE_URL=http://localhost:4000
ZEROZONE_ALLOWED_ORIGINS=http://localhost:3000
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
LIVEKIT_URL=wss://your-livekit-host
```

Create `apps/frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-id
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-host
```

3. **Initialize Database**

```bash
cd apps/backend
pnpm prisma migrate dev
pnpm prisma generate
```

4. **Start Development Servers**

```bash
pnpm dev
```

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:4000>

### Building for Production

```bash
# Build all apps and packages
pnpm build

# Front-end production build
cd apps/frontend
pnpm build
pnpm start

# Backend production build
cd apps/backend
pnpm build
NODE_ENV=production pnpm start
```

## Common Challenges Solved

### Challenge 1: Reconnection During Active Calls
**Problem**: Users refresh the page while in a call and lose connection.
**Solution**: Server maintains call state in memory with participant tracking and the associated LiveKit room. On reconnection, the client queries call status, receives a fresh LiveKit token, and rejoins the room without losing audio context.

### Challenge 2: Network Drops
**Problem**: Temporary connection loss drops calls immediately.
**Solution**: Grace-period timer on disconnect. If the socket reconnects within the window, the call continues. Only terminates after the grace period expires.

### Challenge 3: Stale Presence Updates
**Problem**: Users show as online when they're not (browser crash, no clean disconnect).
**Solution**: Heartbeat-based cleanup. Connections must send heartbeats periodically. Stale connections are pruned automatically, and the user goes offline if no active sockets remain.

### Challenge 4: Friend Privacy
**Problem**: Broadcasting online status to all users wastes bandwidth and violates privacy.
**Solution**: Online/offline events sent only to mutual friends. Non-friends don't receive presence updates.

## Contributing

ZeroZone accepts contributions via pull requests. See the repository for guidelines.

## License

MIT License. See [LICENSE](./LICENSE) file for details.

---

## Contact

**Muhammad** — [@Dev_Muhammad3](https://x.com/Dev_Muhammad3) · muhdid82@gmail.com

Project Link: [github.com/DevMuhammed3/ZeroZone](https://github.com/DevMuhammed3/ZeroZone)
