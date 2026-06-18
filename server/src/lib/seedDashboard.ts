import prisma from './prisma.js';

const SAMPLE_CUSTOMERS = [
  { name: 'Acme Enterprise', email: 'ceo@acme.com', risk: 84, mrr: 4500, health: 22, playbook: 'Value Review Sent' },
  { name: 'Global Logistics', email: 'ops@globallogistics.com', risk: 72, mrr: 1800, health: 35, playbook: 'CSM Call Scheduled' },
  { name: 'DevFlow SaaS', email: 'billing@devflow.io', risk: 59, mrr: 3200, health: 51, playbook: 'Discount Offered' },
  { name: 'Alpha Agency', email: 'contact@alpha.agency', risk: 48, mrr: 2100, health: 62, playbook: 'None' },
  { name: 'Stripe Integrators', email: 'dev@stripeintegrators.net', risk: 24, mrr: 9500, health: 81, playbook: 'None' },
];

const SAMPLE_ALERTS = [
  { text: "Autopilot dispatched: 'High Risk Nudge' to DevFlow SaaS admin.", color: 'text-indigo-600 dark:text-indigo-400' },
  { text: 'Acme Enterprise dropped logins below weekly threshold of 10.', color: 'text-destructive' },
  { text: 'Customer Health score for Alpha Agency decreased from 72 to 62.', color: 'text-yellow-600 dark:text-yellow-400' },
];

const SAMPLE_INTEGRATIONS = [
  { name: 'Stripe', status: 'Active' },
  { name: 'HubSpot', status: 'Active' },
  { name: 'PostgreSQL', status: 'Active' },
];

export async function seedDashboardForUser(userId: number) {
  await prisma.customer.createMany({
    data: SAMPLE_CUSTOMERS.map((c) => ({ ...c, userId })),
  });

  const now = new Date();
  await prisma.alert.createMany({
    data: SAMPLE_ALERTS.map((a, i) => ({
      ...a,
      userId,
      createdAt: new Date(now.getTime() - (i + 1) * 60 * 60 * 1000),
    })),
  });

  await prisma.integration.createMany({
    data: SAMPLE_INTEGRATIONS.map((integration) => ({
      ...integration,
      userId,
      lastSyncAt: new Date(now.getTime() - 4 * 60 * 1000),
    })),
  });
}
