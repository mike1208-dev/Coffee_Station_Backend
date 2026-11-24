import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

export const getHealth = (_req: Request, res: Response) => {
  res.json({ status: "ok" });
};

export const getHealthDb = async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "error" });
  }
};
