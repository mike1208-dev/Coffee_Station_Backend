import { describe, expect, it } from "vitest";
import { parseEnv } from "./env.js";

describe("parseEnv", () => {
  it("returns typed values", () => {
    expect(
      parseEnv({
        NODE_ENV: "test",
        PORT: "3000",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      }),
    ).toEqual({
      NODE_ENV: "test",
      PORT: 3000,
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    });
  });

  it.each([
    [
      "missing PORT",
      { NODE_ENV: "test", DATABASE_URL: "postgresql://localhost/db" },
      /PORT: Invalid input: expected number/,
    ],
    [
      "text PORT",
      {
        NODE_ENV: "test",
        PORT: "abc",
        DATABASE_URL: "postgresql://localhost/db",
      },
      /PORT: Invalid input: expected number/,
    ],
    [
      "PORT 0",
      {
        NODE_ENV: "test",
        PORT: "0",
        DATABASE_URL: "postgresql://localhost/db",
      },
      /PORT: Too small/,
    ],
    [
      "PORT above 65535",
      {
        NODE_ENV: "test",
        PORT: "70000",
        DATABASE_URL: "postgresql://localhost/db",
      },
      /PORT: Too big/,
    ],
    [
      "decimal PORT",
      {
        NODE_ENV: "test",
        PORT: "3000.5",
        DATABASE_URL: "postgresql://localhost/db",
      },
      /PORT: Invalid input: expected int/,
    ],
    [
      "missing NODE_ENV",
      { PORT: "3000", DATABASE_URL: "postgresql://localhost/db" },
      /NODE_ENV:/,
    ],
    [
      "unknown NODE_ENV",
      {
        NODE_ENV: "prod",
        PORT: "3000",
        DATABASE_URL: "postgresql://localhost/db",
      },
      /NODE_ENV:/,
    ],
    [
      "missing DATABASE_URL",
      { NODE_ENV: "test", PORT: "3000" },
      /DATABASE_URL:/,
    ],
    [
      "invalid DATABASE_URL",
      { NODE_ENV: "test", PORT: "3000", DATABASE_URL: "not-a-url" },
      /DATABASE_URL:/,
    ],
  ])("rejects %s", (_name, source, message) => {
    expect(() => parseEnv(source)).toThrow(message);
  });
});
