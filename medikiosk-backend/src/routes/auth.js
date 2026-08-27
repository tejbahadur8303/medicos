import { Router } from 'express';
import { login, me, seedDemoDoctor } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, me);

// Convenience endpoint for the hackathon demo: creates the default
// Dr. Sharma account if it doesn't exist yet. Safe to call repeatedly.
router.post('/seed-demo-doctor', seedDemoDoctor);

export default router;
