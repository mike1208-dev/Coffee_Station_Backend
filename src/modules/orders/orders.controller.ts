import type { Request, Response } from "express";
import { validate } from "../../common/validate.js";
import { createOrderSchema } from "./orders.schema.js";
import { createOrder } from "./orders.service.js";

interface CreateOrderBody {
  customerName: string;
  phone: string;
  items: { productId: string; quantity: number }[];
}

export async function postOrder(
  req: Request<unknown, unknown, CreateOrderBody>,
  res: Response,
) {
  const input = validate(createOrderSchema, req.body as CreateOrderBody);
  const order = await createOrder(input);
  res.status(201).json({
    ...order,
    totalPrice: order.totalPrice.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toNumber(),
    })),
  });
}
