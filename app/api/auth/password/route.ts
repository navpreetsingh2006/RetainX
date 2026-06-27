import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/lib/auth';

// PUT /api/auth/password – change password
export async function PUT(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: 'Both passwords are required' }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ message: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: payload.sub }, data: { passwordHash } });

  return NextResponse.json({ success: true, message: 'Password updated successfully' });
}
