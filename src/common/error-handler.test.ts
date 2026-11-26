import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../app.js";
import { AppError } from "./app-error.js";
import { errorHandler, notFoundHandler } from "./error-handler.js";

function createTestApp() {
  const testApp = express();

  testApp.get("/app-error", () => {
    throw new AppError(409, "Already exists");
  });
  testApp.get("/crash", () => {
    throw new Error("secret database detail");
  });
  testApp.get("/async-crash", async () => {
    throw new Error("secret async detail");
  });
  testApp.post("/echo", express.json(), (req, res) => {
    res.json(req.body);
  });

  testApp.use(notFoundHandler);
  testApp.use(errorHandler);
  return testApp;
}

describe("error handling", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 404 in the shared shape for an unknown route", async () => {
    const res = await request(app).get("/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { message: "Route not found" } });
  });

  it("uses the status and message of an AppError", async () => {
    const res = await request(createTestApp()).get("/app-error");

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: { message: "Already exists" } });
  });

  it("returns 500 without internal details for an unexpected error", async () => {
    const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(createTestApp()).get("/crash");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: { message: "Internal server error" } });
    expect(logSpy).toHaveBeenCalledOnce();
  });

  it("also handles errors thrown in async handlers", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(createTestApp()).get("/async-crash");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: { message: "Internal server error" } });
  });

  it.each([
    ["broken JSON", "{bad", 400, "Invalid request"],
    [
      "a body that is too large",
      JSON.stringify({ data: "x".repeat(200_000) }),
      413,
      "Request body too large",
    ],
  ])("answers %s with its 4xx status", async (_name, body, status, message) => {
    const res = await request(createTestApp())
      .post("/echo")
      .set("Content-Type", "application/json")
      .send(body);

    expect(res.status).toBe(status);
    expect(res.body).toEqual({ error: { message } });
  });
});
