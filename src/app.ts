import express from "express";
import { errorHandler, notFoundHandler } from "./common/error-handler.js";
import { mainRouter } from "./routes/index.js";

export const app = express();

app.use("/", mainRouter);
app.use(notFoundHandler);
app.use(errorHandler);
