import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { prisma } from "../../config/prisma.js";

describe("GET /api/products", () => {
  it("returns all products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(await prisma.product.count());
    expect(res.body).toContainEqual({
      id: expect.any(String),
      name: "Classic Latte",
      category: "Coffee",
      description: "Rich espresso with steamed milk and a light layer of foam.",
      price: 4.5,
      imageUrl: "/images/coffee-1.avif",
      rating: 4.8,
    });
  });

  it("returns only products in the given category", async () => {
    const res = await request(app).get("/api/products?category=Coffee");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(
      await prisma.product.count({ where: { category: "Coffee" } }),
    );
    for (const product of res.body) {
      expect(product.category).toBe("Coffee");
    }
  });

  it("returns 400 for an invalid category", async () => {
    const res = await request(app).get(
      "/api/products?category=NotARealCategory",
    );

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: { message: "Invalid category: NotARealCategory" },
    });
  });
});
