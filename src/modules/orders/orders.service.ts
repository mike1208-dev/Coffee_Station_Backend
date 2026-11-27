import { randomUUID } from "node:crypto";
import { BadRequestError } from "../../common/app-error.js";
import { prisma } from "../../config/prisma.js";

interface CreateOrderInput {
  customerName: string;
  phone: string;
  items: { productId: string; quantity: number }[];
}

export async function createOrder(input: CreateOrderInput) {
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const orderItemsData = input.items.map((item) => {
    const matchedProduct = products.find(({ id }) => id === item.productId);
    if (!matchedProduct) {
      throw new BadRequestError(`Unknown product: ${item.productId}`);
    }
    return {
      productId: matchedProduct.id,
      productName: matchedProduct.name,
      unitPrice: matchedProduct.price,
      quantity: item.quantity,
    };
  });

  const totalPrice = orderItemsData
    .map((item) => item.unitPrice.times(item.quantity))
    .reduce((sum, lineTotal) => sum.plus(lineTotal));

  return prisma.order.create({
    data: {
      orderNumber: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`,
      customerName: input.customerName,
      phone: input.phone,
      totalPrice,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });
}
