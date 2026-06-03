import http from 'http'
import { Server } from 'socket.io'
import { app } from './app.js'
import { connectDatabase } from './config/db.js'
import { env } from './config/env.js'
import { attachSocket } from './services/notification.service.js'

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
})

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId
  if (userId) socket.join(userId)
  socket.emit('system:ready', { message: 'Connected to CelebrateLK notifications' })
})

attachSocket(io)

connectDatabase()
  .then(() => {
    httpServer.listen(env.PORT, () => {
      console.log(`CelebrateLK API running on port ${env.PORT}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start API', error)
    process.exit(1)
  })
