import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllPatients,
  getQueue,
  getPriorityPatients,
  getPatientById,
  getPatientHistory,
  getPatientSummary,
  updatePatientSummary,
  verifyPatient,
  markPriority,
  startConsultation,
  completeConsultation,
  getPatientDocuments,
  getPatientTimeline,
} from '../controllers/patientController.js';

const router = Router();

// All of these are doctor-dashboard-facing reads/actions on patient
// data, so they require a valid doctor session.
router.use(requireAuth);

router.get('/', getAllPatients);
router.get('/queue', getQueue);
router.get('/priority', getPriorityPatients);
router.get('/:id', getPatientById);
router.get('/:id/history', getPatientHistory);
router.get('/:id/summary', getPatientSummary);
router.put('/:id/summary', updatePatientSummary);
router.post('/:id/verify', verifyPatient);
router.post('/:id/mark-priority', markPriority);
router.post('/:id/start-consultation', startConsultation);
router.post('/:id/complete-consultation', completeConsultation);
router.get('/:id/documents', getPatientDocuments);
router.get('/:id/timeline', getPatientTimeline);

export default router;
