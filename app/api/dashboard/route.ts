import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import type { DashboardData, DashboardMetrics, Customer, DashboardAlert, DashboardIntegration } from '@/lib/api';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Missing token' }), { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
  }

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      avatarUrl: true,
    },
  });
  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  // Example static metrics – replace with real calculations later
  const metrics: DashboardMetrics = {
    monitoredMrr: 120000,
    monitoredMrrFormatted: '$120k',
    avgChurnRisk: 0.27,
    avgChurnRiskFormatted: '27%',
    recoveredRevenue: 45000,
    recoveredRevenueFormatted: '$45k',
    activePlaybooks: 5,
    activePlaybooksFormatted: '5',
    mrrTrend: 'up',
    churnTrend: 'down',
    recoveredTrend: 'up',
  };

  // Fetch customers linked to user
  const customers = await prisma.dataset.findMany({
    where: { userId: payload.sub },
    select: {
      id: true,
      name: true,
      description: true,
      // placeholder fields for churn demo
      dataJson: true,
    },
  });
  const formattedCustomers: Customer[] = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.description ?? '',
    risk: (c.dataJson as any).risk ?? 0,
    mrr: (c.dataJson as any).mrr ?? 0,
    health: (c.dataJson as any).health ?? 0,
    playbook: (c.dataJson as any).playbook ?? '',
  }));

  // Alerts – dummy data for now
  const alerts: DashboardAlert[] = [
    { id: 1, text: 'New high‑risk customer detected', color: 'red', time: new Date().toISOString() },
  ];

  // Integrations – dummy list
  const integrations: DashboardIntegration[] = [
    { id: 1, name: 'Salesforce', status: 'connected', lastSync: new Date().toISOString() },
    { id: 2, name: 'HubSpot', status: 'disconnected', lastSync: '' },
  ];

  const data: DashboardData = {
    user,
    metrics,
    customers: formattedCustomers,
    alerts,
    integrations,
    lastSync: new Date().toISOString(),
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
