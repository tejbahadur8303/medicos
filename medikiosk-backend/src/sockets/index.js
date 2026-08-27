import { Server } from 'socket.io';

let io;

/**
 * Initializes Socket.IO on top of the existing HTTP server. The React
 * dashboard connects and joins the 'doctors' room to receive live
 * events whenever a patient registers, a red flag fires, or a status
 * changes — this is what lets a doctor see a new registration/complaint
 * appear without refreshing.
 */
export function initSockets(httpServer, corsOrigins) {
  io = new Server(httpServer, {
    cors: { origin: corsOrigins, credentials: true },
  });

  io.on('connection', (socket) => {
    socket.join('doctors');
    console.log(`[socket] client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });

  return io;
}

/** Emits an event to every connected doctor dashboard client. */
export function emitToDoctors(event, payload) {
  if (!io) return;
  io.to('doctors').emit(event, payload);
}
