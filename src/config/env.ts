import { existsSync } from "node:fs";
import { parseEnv } from "./env.schema.js";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export const env = parseEnv(process.env);
