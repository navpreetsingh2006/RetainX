import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, company, mrr, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    await prisma.contactMessage.create({
      data: { name, email, company: company || null, mrr: mrr || null, message },
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent! We will reply within 2 hours.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!',
      });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getPlatformStats = async (_req: Request, res: Response) => {
  try {
    const [totalUsers, customers, alerts] = await Promise.all([
      prisma.user.count(),
      prisma.customer.findMany({ select: { risk: true } }),
      prisma.alert.count(),
    ]);

    const totalCustomers = customers.length;
    const avgChurnRisk =
      totalCustomers > 0
        ? Math.round(customers.reduce((s, c) => s + c.risk, 0) / totalCustomers)
        : 0;
    const highRiskCount = customers.filter((c) => c.risk >= 70).length;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalAlerts: alerts,
        avgChurnRisk,
        highRiskCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
