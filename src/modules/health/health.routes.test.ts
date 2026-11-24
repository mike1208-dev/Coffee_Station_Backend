import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";

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
});
