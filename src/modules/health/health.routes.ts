import { Router } from "express";
import { getHealth } from "./health.controller.js";

// Lets the host check that the server is running. It does not check the database.
export const healthRouter = Router();

healthRouter.get("/", getHealth);
