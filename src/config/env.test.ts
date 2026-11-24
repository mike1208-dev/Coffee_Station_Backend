import { describe, expect, it } from "vitest";
import { parseEnv } from "./env.js";

describe("parseEnv", () => {
  it("returns typed values", () => {
    expect(parseEnv({ NODE_ENV: "test", PORT: "3000" })).toEqual({
      NODE_ENV: "test",
      PORT: 3000,
    });
  });

  it.each([
    [
      "missing PORT",
      { NODE_ENV: "test" },
      /PORT: Invalid input: expected number/,
    ],
    [
      "text PORT",
      { NODE_ENV: "test", PORT: "abc" },
      /PORT: Invalid input: expected number/,
    ],
    ["PORT 0", { NODE_ENV: "test", PORT: "0" }, /PORT: Too small/],
    ["PORT above 65535", { NODE_ENV: "test", PORT: "70000" }, /PORT: Too big/],
    [
      "decimal PORT",
      { NODE_ENV: "test", PORT: "3000.5" },
      /PORT: Invalid input: expected int/,
    ],
    ["missing NODE_ENV", { PORT: "3000" }, /NODE_ENV:/],
    ["unknown NODE_ENV", { NODE_ENV: "prod", PORT: "3000" }, /NODE_ENV:/],
  ])("rejects %s", (_name, source, message) => {
    expect(() => parseEnv(source)).toThrow(message);
  });
});
