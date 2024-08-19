import z from "zod";
import dotenv from "dotenv";
dotenv.config();

const mainConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production", "local"])
    .default("development"),
  PORT: z.string().transform(Number),
  OPENAI_API_KEY: z.string(),
  OPENAI_DURATION: z.string().transform(Number),
  OPENAI_MAX_REQ_BY_DURATION: z.string().transform(Number),
  OPENAI_CONCURRENCY: z.string().transform(Number),
  DB_HOST: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
});

const cfg = mainConfigSchema.parse(process.env);
type MainConfig = z.infer<typeof mainConfigSchema>;
export { cfg, mainConfigSchema, MainConfig };
