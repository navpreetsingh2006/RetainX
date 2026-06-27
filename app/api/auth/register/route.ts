import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { name, email, password, company } = await request.json();
  if (!email || !password || !name) {
    return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, company },
  });
  const token = generateToken(user);
  return NextResponse.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, company: user.company } });
}