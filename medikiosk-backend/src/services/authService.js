import jwt from 'jsonwebtoken';

export function signToken(doctor) {
  return jwt.sign(
    { id: doctor._id.toString(), name: doctor.name, email: doctor.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
