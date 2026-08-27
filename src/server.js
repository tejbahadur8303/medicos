import http from "http";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";

async function start() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  // Socket.IO only for local development
  if (process.env.VERCEL !== "1") {
    initSocket(server);

    server.listen(process.env.PORT || 8080, () => {
      console.log(
        `[medikiosk] Backend running on http://localhost:${process.env.PORT || 8080}`
      );

      console.log("[medikiosk] Socket.IO ready");
    });

    const shutdown = (signal) => {
      console.log(`[medikiosk] ${signal} received, shutting down`);

      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  }
}

start().catch((err) => {
  console.error("[medikiosk] failed to start:", err);
  process.exit(1);
});