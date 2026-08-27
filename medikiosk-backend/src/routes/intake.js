import express from "express";
const router = express.Router();

import {
  createSession,
  submitAnswer,
  generateSummary,
  submitSession,
  alertRedFlag,
  getSession,
} from '../controllers/intakeController.js';

router.post('/patient/session', createSession);
router.post('/history/answer', submitAnswer);
router.post('/summary/generate', generateSummary);
router.post('/session/submit', submitSession);
router.post('/redflag/alert', alertRedFlag);
router.get('/session/:id', getSession);

export default router;