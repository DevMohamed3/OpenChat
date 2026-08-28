import "dotenv/config"
import http from 'http'
import { Server } from 'socket.io'
import { app } from './app.js'
import { privateChatHandler } from './socket/privateChat.js'
import { isAllowedOrigin } from './config/origin.js'
import { socketAuth } from './socket/auth.js'
import { prisma } from './config/prisma.js'
import { callHandler } from "./socket/callHandler.js"
import { channelCallHandler } from "./socket/channelCallHandler.js"
import {
  refreshConnection,
  registerConnection,
  resetPresenceState,
  startPresenceCleanup,
  unregisterConnection,
  addUserToZone,
  removeUserFromZone,
  getZoneOnlineUsers,
} from "./socket/presence.js"
import { emitFriendState } from "./services/friendRealtime.js"
import { safeHandler } from "./socket/safeHandler.js"

const port = process.env.PORT || 4000

const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true)
      }
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  },
})

io.use(socketAuth)

const PRESENCE_RESET_ATTEMPTS = 5
const PRESENCE_RESET_RETRY_MS = 2000

async function bootstrapPresenceState() {
  for (let attempt = 1; attempt <= PRESENCE_RESET_ATTEMPTS; attempt++) {
    try {
      await resetPresenceState()
      return
    } catch (err) {
      console.error(
        `[Presence] Failed to reset presence state (attempt ${attempt}/${PRESENCE_RESET_ATTEMPTS}):`,
        err
      )
      if (attempt < PRESENCE_RESET_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, PRESENCE_RESET_RETRY_MS * attempt))
      }
    }
  }
  console.warn(
    '[Presence] Starting without presence reset — users may stay flagged online until their next connect/disconnect cycle'
  )
}

await bootstrapPresenceState()
const presenceCleanup = startPresenceCleanup(io)

io.on('connection', (socket) => {
  const userId = socket.data.userId
  if (!userId) return

  socket.join(`user:${userId}`)

  // Register every handler synchronously — before any awaited DB work — so
  // events emitted right after connect are never silently dropped.
  privateChatHandler(io, socket)
  callHandler(io, socket)
  channelCallHandler(io, socket)

  socket.onAny(() => {
    refreshConnection(userId, socket.id)
  })

  socket.on("presence:heartbeat", () => {
    refreshConnection(userId, socket.id)
  })

  socket.on("zone:join", safeHandler(async (data: { zonePublicId: string }) => {
    const { zonePublicId } = data
    if (!zonePublicId) return

    const member = await prisma.chatParticipant.findFirst({
      where: {
        userId,
        chat: {
          publicId: zonePublicId,
          type: "ZONE",
        },
      },
    })

    if (!member) return

    socket.join(`zone:${zonePublicId}`)
    addUserToZone(zonePublicId, userId)

    const onlineUsers = getZoneOnlineUsers(zonePublicId)
    io.to(`zone:${zonePublicId}`).emit("zone:presence", {
      zonePublicId,
      onlineUsers,
    })
  }))

  socket.on("zone:leave", (data: { zonePublicId: string }) => {
    const { zonePublicId } = data
    if (!zonePublicId) return

    socket.leave(`zone:${zonePublicId}`)
    removeUserFromZone(zonePublicId, userId)

    const onlineUsers = getZoneOnlineUsers(zonePublicId)
    io.to(`zone:${zonePublicId}`).emit("zone:presence", {
      zonePublicId,
      onlineUsers,
    })
  })

  socket.on('disconnect', safeHandler(async () => {
    await unregisterConnection(io, userId, socket.id)
  }))

  void initializeConnection(socket, userId)
})

async function initializeConnection(socket: import('socket.io').Socket, userId: number) {
  try {
    await registerConnection(io, userId, socket.id)
    await emitFriendState(io, userId)

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      select: {
        publicId: true,
      },
    })

    for (const chat of chats) {
      socket.join(`chat:${chat.publicId}`)
    }
  } catch (err) {
    console.error('[Socket] Connection initialization failed:', err)
  }
}

server.listen(port, () => { console.log(`Server running on port ${port}`) })

process.on("exit", () => {
  presenceCleanup.stop()
})
