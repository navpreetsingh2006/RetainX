import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/datasets – list user's datasets
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const datasets = await prisma.dataset.findMany({
    where: { userId: payload.sub },
    include: { charts: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ success: true, datasets });
}

// POST /api/datasets – create a new dataset
export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { name, description, dataJson } = await request.json();
  if (!name || !dataJson) {
    return NextResponse.json({ message: 'Name and data are required' }, { status: 400 });
  }

  const dataset = await prisma.dataset.create({
    data: { name, description, dataJson, userId: payload.sub },
  });
  return NextResponse.json({ success: true, dataset });
}
