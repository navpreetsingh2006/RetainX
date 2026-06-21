import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../lib/prisma.js';
import { seedDashboardForUser } from '../lib/seedDashboard.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password, company, username, plan } = req.body;

    if (!name || !email || !password || !company) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company,
        username: username || null,
        plan: plan || 'trial',
      },
    });

    await seedDashboardForUser(user.id);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        username: user.username,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        username: true,
        plan: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and Password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, company, username, plan } = req.body;

    if (!name || !company) {
      return res.status(400).json({
        success: false,
        message: 'Name and Company are required',
      });
    }

    if (username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        company,
        username: username || null,
        plan: plan || 'trial',
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        username: true,
        plan: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};