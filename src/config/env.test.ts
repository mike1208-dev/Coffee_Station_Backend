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
    ["missing PORT", { NODE_ENV: "test" }, /PORT: must be a number/],
    ["text PORT", { NODE_ENV: "test", PORT: "abc" }, /PORT: must be a number/],
    ["PORT out of range", { NODE_ENV: "test", PORT: "70000" }, /PORT:/],
    ["missing NODE_ENV", { PORT: "3000" }, /NODE_ENV:/],
    ["unknown NODE_ENV", { NODE_ENV: "prod", PORT: "3000" }, /NODE_ENV:/],
  ])("rejects %s", (_name, source, message) => {
    expect(() => parseEnv(source)).toThrow(message);
  });
});
