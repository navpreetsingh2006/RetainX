import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

type Params = { params: { id: string } };

// DELETE /api/datasets/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id);
  const dataset = await prisma.dataset.findFirst({ where: { id, userId: payload.sub } });
  if (!dataset) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  // Delete associated charts first
  await prisma.chart.deleteMany({ where: { datasetId: id } });
  await prisma.dataset.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

// PUT /api/datasets/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = request.headers.get('authorization');
  const payload = auth ? verifyToken(auth.replace('Bearer ', '')) : null;
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = parseInt(params.id);
  const { name, description, dataJson } = await request.json();

  const dataset = await prisma.dataset.findFirst({ where: { id, userId: payload.sub } });
  if (!dataset) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const updated = await prisma.dataset.update({
    where: { id },
    data: { name, description, dataJson },
  });
  return NextResponse.json({ success: true, dataset: updated });
}
