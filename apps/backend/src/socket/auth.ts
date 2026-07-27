import jwt from "jsonwebtoken"
import { Socket } from "socket.io"
import cookie from "cookie"

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const rawCookie = socket.request.headers.cookie
    if (!rawCookie) return next(new Error("No auth cookie"))

    const cookies = cookie.parse(rawCookie)
    const token = cookies.token

    if (!token) return next(new Error("No token"))

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: number }

    socket.data.userId = decoded.id
    next()
  } catch {
    next(new Error("Unauthorized"))
  }
}

