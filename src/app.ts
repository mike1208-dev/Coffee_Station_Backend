import express from "express";
import { healthRouter } from "./modules/health/health.routes.js";

export const app = express();

app.use("/health", healthRouter);
