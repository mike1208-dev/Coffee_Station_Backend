import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app.js";
import { prisma } from "../../config/prisma.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /health", () => {
  it("returns 200 and status ok as JSON", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("GET /health/db", () => {
  it("returns 200 and status ok when the database is reachable", async () => {
    const response = await request(app).get("/health/db");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns 503 and status error when the database is down", async () => {
    vi.spyOn(prisma, "$queryRaw").mockRejectedValue(new Error("db down"));

    const response = await request(app).get("/health/db");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: "error" });
  });
});
