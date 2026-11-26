import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes.js";

export const mainRouter = Router();

mainRouter.use("/health", healthRouter);
