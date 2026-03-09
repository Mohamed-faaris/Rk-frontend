import { z } from 'zod';

const envSchema = z.object({
  MODE: z.enum(['api', 'full']),
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.string(),
  CLIENT_URLS: z.string(),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRE: z.string(),
  EMAIL_SERVICE: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_FROM: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_REDIRECT_URI: z.string().optional(),
  APPLE_SCOPES: z.string(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  FACEBOOK_GRAPH_VERSION: z.string(),
  SKIP_OTP: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
