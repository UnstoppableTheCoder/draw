import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { env } from "../../config/env";
import type { Request, Response } from "express";

const COOKIE_NAME = "accessToken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const createToken = (userId: string) =>
  jwt.sign({ userId, role: "admin" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });

    const token = createToken(user.id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Signup successful.",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastSeen: new Date(),
      },
    });

    const token = createToken(user.id);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    return res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const signout = async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);

  return res.json({
    message: "Logged out successfully.",
  });
};

export const me = async (req: Request, res: Response) => {
  const userId = req.userId;

  const user = await prisma.user.findFirst({ where: { id: userId } });

  return res.json({ user });
};
