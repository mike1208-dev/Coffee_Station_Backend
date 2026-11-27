import { z } from "zod";

export const createOrderSchema = z
  .object({
    customerName: z.string().trim().min(1).max(100),
    phone: z.string().trim().min(1).max(30),
    items: z
      .array(
        z
          .object({
            productId: z.string().min(1),
            quantity: z.int().positive().max(20),
          })
          .strict(),
      )
      .min(1)
      .refine(
        (items) =>
          new Set(items.map((item) => item.productId)).size === items.length,
        "Each product can appear only once",
      ),
  })
  .strict();
