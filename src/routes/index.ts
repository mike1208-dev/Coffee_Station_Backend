import { Router } from "express";
import { productsRouter } from "../modules/products/products.routes.js";
import { ordersRouter } from "../modules/orders/orders.routes.js";

export const mainRouter = Router();

mainRouter.use("/products", productsRouter);
mainRouter.use("/orders", ordersRouter);
