import express from "express";
import { errorHandler, notFoundHandler } from "./common/error-handler.js";
import { mainRouter } from "./routes/index.js";
import { healthRouter } from "./modules/health/health.routes.js";

export const app = express();

app.use("/health", healthRouter);
app.use("/api", mainRouter);
app.use(notFoundHandler);
app.use(errorHandler);
