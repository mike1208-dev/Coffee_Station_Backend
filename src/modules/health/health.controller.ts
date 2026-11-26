import type { Request, Response } from "express";
import { checkDatabase } from "./health.service.js";

export const getHealth = (_req: Request, res: Response) => {
  res.json({ status: "ok" });
};

export const getHealthDb = async (_req: Request, res: Response) => {
  try {
    await checkDatabase();
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "error" });
  }
};
