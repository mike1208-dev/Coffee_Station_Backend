import { Router } from "express";
import { getHealth, getHealthDb } from "./health.controller.js";

// GET /health checks the server only. GET /health/db also checks the database.
export const healthRouter = Router();

healthRouter.get("/", getHealth);
healthRouter.get("/db", getHealthDb);
