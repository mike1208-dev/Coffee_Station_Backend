/// <reference types="node" />
import { existsSync } from "node:fs";
import { defineConfig, env } from "prisma/config";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
