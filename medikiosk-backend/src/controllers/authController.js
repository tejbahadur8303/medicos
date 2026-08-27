import { Doctor } from '../models/Doctor.js';
import { signToken } from '../services/authService.js';

/** POST /api/auth/login */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email: (email || '').toLowerCase() });
    if (!doctor) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await doctor.comparePassword(password || '');
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    doctor.online = true;
    await doctor.save();

    const token = signToken(doctor);
    res.json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        department: doctor.department,
        hospital: doctor.hospital,
      },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/auth/me — returns the logged-in doctor's profile. */
export async function me(req, res, next) {
  try {
    const doctor = await Doctor.findById(req.doctor.id).select('-passwordHash');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
}

/** POST /api/auth/seed-demo-doctor — creates Dr. Sharma / demo123 if absent. */
export async function seedDemoDoctor(req, res, next) {
  try {
    const existing = await Doctor.findOne({ email: 'sharma@demohospital.in' });
    if (existing) return res.json({ ok: true, message: 'Demo doctor already exists', email: existing.email });

    const passwordHash = await Doctor.hashPassword('demo123');
    const doctor = await Doctor.create({
      name: 'Dr. Sharma',
      email: 'sharma@demohospital.in',
      passwordHash,
      department: 'General Medicine',
      hospital: 'Demo Government Hospital',
    });

    res.json({ ok: true, email: doctor.email, password: 'demo123' });
  } catch (err) {
    next(err);
  }
}
