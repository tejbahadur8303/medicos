import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let dbConnected = false;

export default async function handler(req, res) {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("[vercel] Server error:", error);

    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
