import { io, type Socket } from "socket.io-client";

// Use environment variable if provided (Vite/React conventions), fallback to localhost:3001
const SOCKET_URL =
	(typeof process !== 'undefined' && (process.env.VITE_SOCKET_URL || process.env.REACT_APP_SOCKET_URL)) ||
	"http://localhost:3001";

export const socket: Socket = io(SOCKET_URL);

