import { Router } from "express";
import { productsRouter } from "../modules/products/products.routes.js";

export const mainRouter = Router();

mainRouter.use("/products", productsRouter);
