import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../config/prisma.js";

const createdOrderIds: string[] = [];

afterEach(async () => {
  await prisma.order.deleteMany({ where: { id: { in: createdOrderIds } } });
  createdOrderIds.length = 0;
});

async function createOrder(orderNumber = `TEST-${randomUUID()}`) {
  const product = await prisma.product.findFirstOrThrow({
    where: { name: "Classic Latte" },
  });
  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: "Test Customer",
      phone: "000-0000-0000",
      totalPrice: product.price.mul(3),
      items: {
        create: [
          {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: 3,
          },
        ],
      },
    },
    include: { items: true },
  });
  createdOrderIds.push(order.id);
  return order;
}

describe("Order model", () => {
  it("saves an order with its items and reads them back", async () => {
    const order = await createOrder();

    const saved = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
      include: { items: true },
    });

    expect(saved.status).toBe("Pending");
    expect(saved.totalPrice.toString()).toBe("13.5");
    expect(saved.items).toHaveLength(1);
    expect(saved.items[0]!.productName).toBe("Classic Latte");
    expect(saved.items[0]!.unitPrice.toString()).toBe("4.5");
    expect(saved.items[0]!.quantity).toBe(3);
  });

  it("rejects a duplicate order number", async () => {
    const order = await createOrder();

    await expect(createOrder(order.orderNumber)).rejects.toMatchObject({
      code: "P2002",
    });
  });

  it("deletes the items when the order is deleted", async () => {
    const order = await createOrder();

    await prisma.order.delete({ where: { id: order.id } });

    expect(await prisma.orderItem.count({ where: { orderId: order.id } })).toBe(
      0,
    );
  });
});

describe("Product in an order", () => {
  it("cannot be deleted", async () => {
    const order = await createOrder();
    const productId = order.items[0]!.productId;

    await expect(
      prisma.product.delete({ where: { id: productId } }),
    ).rejects.toMatchObject({ code: "P2003" });
    expect(await prisma.product.count({ where: { id: productId } })).toBe(1);
  });
});
