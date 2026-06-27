import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME_SECRET'; // should be set in .env

export function generateToken(user: User): string {
  const payload = { sub: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: number; email: string };
  } catch {
    return null;
  }
}
