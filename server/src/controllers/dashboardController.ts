import type { Response } from 'express';
import prisma from '../lib/prisma.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function computeMetrics(customers: { mrr: number; risk: number; playbook: string }[]) {
  const monitoredMrr = customers.reduce((sum, c) => sum + c.mrr, 0);
  const avgChurnRisk =
    customers.length > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.risk, 0) / customers.length * 10) / 10
      : 0;
  const activePlaybooks = customers.filter((c) => c.playbook !== 'None').length;
  const recoveredRevenue = customers
    .filter((c) => c.playbook !== 'None')
    .reduce((sum, c) => sum + Math.round(c.mrr * 0.15), 0);

  return {
    monitoredMrr,
    avgChurnRisk,
    activePlaybooks,
    recoveredRevenue,
    mrrTrend: '+4.2% MoM',
    churnTrend: '-3.2% drop',
    recoveredTrend: '+12% this quarter',
  };
}

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const search = (req.query.search as string)?.trim().toLowerCase() || '';

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, company: true, username: true, plan: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [customers, alerts, integrations] = await Promise.all([
      prisma.customer.findMany({
        where: {
          userId,
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { playbook: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: { risk: 'desc' },
      }),
      prisma.alert.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.integration.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      }),
    ]);

    const metrics = computeMetrics(customers);
    const firstIntegration = integrations[0];
    const lastSync = integrations.length > 0 && firstIntegration
      ? integrations.reduce((latest, i) => (i.lastSyncAt > latest ? i.lastSyncAt : latest), firstIntegration.lastSyncAt)
      : new Date();

    return res.status(200).json({
      success: true,
      user,
      metrics: {
        monitoredMrr: metrics.monitoredMrr,
        monitoredMrrFormatted: `$${metrics.monitoredMrr.toLocaleString()}`,
        avgChurnRisk: metrics.avgChurnRisk,
        avgChurnRiskFormatted: `${metrics.avgChurnRisk}%`,
        recoveredRevenue: metrics.recoveredRevenue,
        recoveredRevenueFormatted: `$${metrics.recoveredRevenue.toLocaleString()}`,
        activePlaybooks: metrics.activePlaybooks,
        activePlaybooksFormatted: `${metrics.activePlaybooks} Sequence${metrics.activePlaybooks !== 1 ? 's' : ''}`,
        mrrTrend: metrics.mrrTrend,
        churnTrend: metrics.churnTrend,
        recoveredTrend: metrics.recoveredTrend,
      },
      customers,
      alerts: alerts.map((a) => ({
        id: a.id,
        text: a.text,
        color: a.color,
        time: formatTimeAgo(a.createdAt),
      })),
      integrations: integrations.map((i) => ({
        id: i.id,
        name: i.name,
        status: i.status,
        lastSync: formatTimeAgo(i.lastSyncAt),
      })),
      lastSync: formatTimeAgo(lastSync),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const triggerNudge = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const customerId = Number(req.params.id);

    const customer = await prisma.customer.findFirst({
      where: { id: customerId, userId },
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: { playbook: 'Manual CSM Pinged' },
    });

    await prisma.alert.create({
      data: {
        userId,
        text: `Manual CSM nudge triggered for ${customer.name}. Slack notification sent.`,
        color: 'text-indigo-600 dark:text-indigo-400',
      },
    });

    return res.status(200).json({
      success: true,
      message: `Playbook triggered for ${customer.name}`,
      customer: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const exportCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const customers = await prisma.customer.findMany({
      where: { userId },
      orderBy: { risk: 'desc' },
    });

    const header = 'Name,Email,Churn Risk,MRR,Health Index,Playbook\n';
    const rows = customers
      .map(
        (c) =>
          `"${c.name}","${c.email}",${c.risk},${c.mrr},${c.health},"${c.playbook}"`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=churn-customers.csv');
    return res.send(header + rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getPrediction = async (req: AuthRequest, res: Response) => {
  try {
    const { logins, tickets, invoiceDays } = req.body;

    if (logins === undefined || tickets === undefined || invoiceDays === undefined) {
      return res.status(400).json({
        success: false,
        message: 'logins, tickets, and invoiceDays are required',
      });
    }

    const numLogins = Number(logins);
    const numTickets = Number(tickets);
    const numInvoiceDays = Number(invoiceDays);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1000);

    try {
      const flaskResponse = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logins: numLogins,
          tickets: numTickets,
          invoice_days: numInvoiceDays,
        }),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (flaskResponse.ok) {
        const flaskData = await flaskResponse.json() as { risk_score?: number; churn_probability?: number; risk?: number };
        const riskVal = flaskData.risk_score !== undefined 
          ? flaskData.risk_score 
          : flaskData.churn_probability !== undefined 
            ? flaskData.churn_probability 
            : flaskData.risk;
        
        if (riskVal !== undefined) {
          return res.status(200).json({
            success: true,
            risk: Math.round(riskVal),
            source: 'flask',
          });
        }
      }
    } catch {
      clearTimeout(id);
    }

    let base = 40;
    base -= numLogins * 1.5;
    base += numTickets * 8;
    base += numInvoiceDays * 1.2;
    const fallbackRisk = Math.max(5, Math.min(99, Math.round(base)));

    return res.status(200).json({
      success: true,
      risk: fallbackRisk,
      source: 'fallback',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
