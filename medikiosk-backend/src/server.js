import "dotenv/config";

import http from "http";

import app from "./app.js";

import { connectDB } from "./config/db.js";
import { initSockets } from "./sockets/index.js";

const PORT = process.env.PORT || 8080;

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const server = http.createServer(app);

initSockets(server, CORS_ORIGIN);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `[server] MediKiosk backend running on http://localhost:${PORT}`,
    );

    console.log(`[server] Socket.IO ready for doctor dashboard live updates`);
  });
});
