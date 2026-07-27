import jwt from 'jsonwebtoken';
import { User } from '../generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME_SECRET'; // should be set in .env

export function generateToken(user: User): string {
  const payload = { sub: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: number; email: string } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return jwt.verify(token, JWT_SECRET) as unknown as { sub: number; email: string };
  } catch {
    return { sub: 0, email: '' };
  }
}
