import { Notification } from '../models/Notification.js';
import { Patient } from '../models/Patient.js';

/** GET /api/notifications — most recent first. */
export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(
      notifications.map((n) => ({
        id: n._id.toString(),
        level: n.level,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        patientId: n.patient?.toString(),
        read: n.read,
      })),
    );
  } catch (err) {
    next(err);
  }
}

/** POST /api/notifications/:id/read */
export async function markNotificationRead(req, res, next) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/doctor/notes
 * Doctor-authored consultation notes. Never auto-filled by AI — the
 * doctor has full control of this content per the product's safety
 * requirements.
 */
export async function saveDoctorNote(req, res, next) {
  try {
    const { patientId, content, status } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    patient.notes.push({
      content,
      status: status === 'final' ? 'final' : 'draft',
      doctorName: req.doctor?.name || 'Unknown',
      savedAt: new Date(),
    });
    await patient.save();

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}
