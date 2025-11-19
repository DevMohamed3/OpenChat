<<<<<<< HEAD
// // apps/backend/src/index.ts
// import express from 'express'
// import http from 'http'
// import { Server } from 'socket.io'
// import cors from 'cors'
// import dotenv from 'dotenv'

// dotenv.config()
=======
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './modules/AuthRoutes.js'
import { authMiddleware } from './middleware/auth.js'

dotenv.config()
>>>>>>> 86353ff774e67d8a05bc95852e232a8785e7a463

// const app = express()
// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: { origin: '*' }
// })

// app.use(cors())
// app.use(express.json())

<<<<<<< HEAD
// app.get('/', (req, res) => {
//   res.json({ message: 'OpenChat Backend Working!' })
// })

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id)
//   // handle chat messages
//   socket.on('send-message', (message: string) => {
//     console.log('Received message from', socket.id, message)
//     // broadcast to all connected clients
//     io.emit('receive-message', message)
//   })
// })

// server.listen(3001, () => {
//   console.log('Server running on http://localhost:3001')
// })

import { app } from "./app.js";

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
=======
// -----------------------------
//        AUTH ROUTES
// -----------------------------
app.use('/api/auth', authRoutes)

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized!', userId: (req as any).userId })
})

// -----------------------------
//        MAIN ROOT
// -----------------------------
app.get('/', (req, res) => {
  res.json({ message: 'OpenChat Backend Working!' })
})

// -----------------------------
//       SOCKET.IO CHAT
// -----------------------------
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('send-message', (message: string) => {
    console.log('Received message from', socket.id, message)
    io.emit('receive-message', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// -----------------------------
//       SERVER LISTEN
// -----------------------------
const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
>>>>>>> 86353ff774e67d8a05bc95852e232a8785e7a463
