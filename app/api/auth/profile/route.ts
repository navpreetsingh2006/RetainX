import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/lib/auth';

// GET /api/auth/profile – fetch current user profile
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, company: true, avatarUrl: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  return NextResponse.json({ success: true, user });
}

// PUT /api/auth/profile – update name / company / username / avatarUrl
export async function PUT(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { name, company, avatarUrl } = await request.json();
  if (!name || !company) {
    return NextResponse.json({ message: 'Name and company are required' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: payload.sub },
    data: { name, company, ...(avatarUrl !== undefined && { avatarUrl }) },
    select: { id: true, name: true, email: true, company: true, avatarUrl: true },
  });
  return NextResponse.json({ success: true, user, message: 'Profile updated successfully' });
}
