import { verifyToken } from '../services/authService.js';

/**
 * Protects doctor-facing routes. The Flutter kiosk app's patient-intake
 * routes are intentionally NOT behind this middleware (a patient at a
 * hospital kiosk has no doctor login) — only endpoints that expose
 * patient data to a dashboard user require a valid doctor session.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = verifyToken(token);
    req.doctor = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
