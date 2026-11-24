import { z } from "zod";

// No defaults: a missing value must stop startup, not run with a guess.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number("must be a number").int().min(1).max(65535),
});

export const parseEnv = (source: NodeJS.ProcessEnv) => {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${problems}`);
  }
  return result.data;
};
