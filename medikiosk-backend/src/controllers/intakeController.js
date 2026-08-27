import { Patient } from '../models/Patient.js';
import { Notification } from '../models/Notification.js';
import { evaluateRedFlags, priorityFromFlags } from '../services/redFlagService.js';
import { emitToDoctors } from '../sockets/index.js';

let tokenCounter = 100;
function nextToken() {
  tokenCounter += 1;
  return `A-${tokenCounter}`;
}

/**
 * POST /api/patient/session
 * Called by the Flutter app right after registration + consent, before
 * the chief complaint is known. Creates the patient record the doctor
 * dashboard will track from this point forward.
 */
export async function createSession(req, res, next) {
  try {
    const { name, age, gender, mobileNumber, abhaId, language, isGuest, consent } = req.body;

    const patient = await Patient.create({
      token: nextToken(),
      name,
      age,
      gender,
      mobileNumber,
      abhaId,
      language,
      isGuest,
      consent: consent || { given: false },
      status: 'NEW',
    });

    emitToDoctors('patient:new', { patientId: patient._id, token: patient.token, name: patient.name });

    res.status(201).json({ sessionId: patient._id, token: patient.token, ok: true });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/history/answer
 * Called repeatedly by the Flutter adaptive-history screen as the
 * patient answers each question. Accumulates raw answers so red flags
 * can be re-evaluated on every submission.
 */
export async function submitAnswer(req, res, next) {
  try {
    const { sessionId, questionId, category, value } = req.body;
    const patient = await Patient.findById(sessionId);
    if (!patient) return res.status(404).json({ error: 'Patient session not found' });

    patient.historyOfPresentIllness = patient.historyOfPresentIllness || {};
    patient.historyOfPresentIllness[questionId] = value;
    if (category) patient.markModified('historyOfPresentIllness');

    const flags = evaluateRedFlags(patient.historyOfPresentIllness);
    const previousFlagCount = patient.redFlags?.length || 0;
    patient.redFlags = flags;
    patient.priority = priorityFromFlags(flags);
    if (patient.priority === 'priority' && patient.status !== 'IN_CONSULTATION' && patient.status !== 'COMPLETED') {
      patient.status = 'PRIORITY';
    }

    await patient.save();

    if (flags.length > previousFlagCount) {
      await Notification.create({
        level: 'priority',
        title: 'Priority patient detected',
        message: `${patient.name} has a potential red-flag symptom.`,
        patient: patient._id,
      });
      emitToDoctors('patient:priority', {
        patientId: patient._id,
        name: patient.name,
        token: patient.token,
        redFlags: flags,
      });
    }

    emitToDoctors('patient:updated', { patientId: patient._id });

    res.json({ ok: true, redFlags: flags, priority: patient.priority });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/summary/generate
 * Called once the Flutter app has collected chief complaint, history,
 * medications, allergies, family/personal history, and review of
 * systems. Composes the structured, doctor-editable summary — this
 * backend step is where a real LLM call would happen (server-side only,
 * see services/aiSummaryService.js), never in the Flutter app itself.
 */
export async function generateSummary(req, res, next) {
  try {
    const {
      sessionId,
      chiefComplaint,
      pastHistory,
      medications,
      allergies,
      familyHistory,
      personalHistory,
      reviewOfSystems,
    } = req.body;

    const patient = await Patient.findById(sessionId);
    if (!patient) return res.status(404).json({ error: 'Patient session not found' });

    patient.chiefComplaint = chiefComplaint ?? patient.chiefComplaint;
    patient.pastHistory = pastHistory ?? patient.pastHistory;
    patient.medications = medications ?? patient.medications;
    patient.allergies = allergies ?? patient.allergies;
    patient.familyHistory = familyHistory ?? patient.familyHistory;
    patient.personalHistory = personalHistory ?? patient.personalHistory;
    patient.reviewOfSystems = reviewOfSystems ?? patient.reviewOfSystems;

    const flags = evaluateRedFlags(patient.historyOfPresentIllness);
    patient.redFlags = flags;
    patient.priority = priorityFromFlags(flags);

    patient.summary = {
      chiefComplaint: patient.chiefComplaint,
      historyOfPresentIllness: Object.values(patient.historyOfPresentIllness || {}).filter(
        (v) => typeof v === 'string' && v.trim() !== '',
      ),
      pastMedicalHistory: patient.pastHistory || [],
      pastSurgicalHistory: [],
      medications: patient.medications || [],
      allergies: patient.allergies || [],
      familyHistory: patient.familyHistory || [],
      personalHistory: patient.personalHistory || {},
      reviewOfSystems: patient.reviewOfSystems || {},
      confidence: 90, // placeholder extraction-confidence score; wire to a real model server-side
      verified: false,
      generatedAt: new Date(),
    };

    patient.status = patient.priority === 'priority' ? 'PRIORITY' : 'WAITING';

    await patient.save();

    emitToDoctors('patient:summary-ready', { patientId: patient._id, name: patient.name, token: patient.token });
    await Notification.create({
      level: 'info',
      title: 'New patient history ready',
      message: `${patient.name}'s history is ready for review.`,
      patient: patient._id,
    });

    res.json({ ok: true, summary: patient.summary });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/session/submit
 * Final Flutter step — patient has reviewed and confirmed their own
 * summary. This is what actually places them in the doctor's queue.
 */
export async function submitSession(req, res, next) {
  try {
    const { sessionId, documents, redFlags } = req.body;
    const patient = await Patient.findById(sessionId);
    if (!patient) return res.status(404).json({ error: 'Patient session not found' });

    if (Array.isArray(redFlags) && redFlags.length > 0) {
      patient.redFlags = redFlags;
      patient.priority = 'priority';
    }

    patient.status = patient.priority === 'priority' ? 'PRIORITY' : 'WAITING';
    await patient.save();

    emitToDoctors('patient:submitted', {
      patientId: patient._id,
      name: patient.name,
      token: patient.token,
      priority: patient.priority,
    });

    res.json({ ok: true, patientId: patient._id, tokenNumber: patient.token });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/redflag/alert
 * Explicit "Alert Hospital Staff" action from the Flutter app.
 */
export async function alertRedFlag(req, res, next) {
  try {
    const { patientId, flags } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    await Notification.create({
      level: 'priority',
      title: 'Priority patient detected',
      message: `${patient.name} has a potential red-flag symptom.`,
      patient: patient._id,
    });

    emitToDoctors('patient:priority', { patientId: patient._id, name: patient.name, token: patient.token, redFlags: flags });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/** GET /api/session/:id — lets the Flutter app resume/check its own session. */
export async function getSession(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Session not found' });
    res.json(patient);
  } catch (err) {
    next(err);
  }
}
