import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  MODE: z.enum(['api', 'full']).default('api'),
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  PORT: z.string().default('3000'),
  CLIENT_URLS: z.string().default(''),
  MONGODB_URI: z.string().default(''),
  JWT_SECRET: z.string().default('change-me-in-production'),
  JWT_EXPIRE: z.string().default('7d'),
  EMAIL_SERVICE: z.string().default(''),
  EMAIL_USER: z.string().default(''),
  EMAIL_PASSWORD: z.string().default(''),
  EMAIL_FROM: z.string().default(''),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_REDIRECT_URI: z.string().optional(),
  APPLE_SCOPES: z.string().default('name email'),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  FACEBOOK_GRAPH_VERSION: z.string().default('v20.0'),
  SKIP_OTP: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
let resolvedEnv;

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  // Do not terminate serverless initialization; keep runtime alive for non-dependent routes.
  // Defaults are intentionally permissive to avoid Vercel cold-start crashes.
  resolvedEnv = envSchema.parse({});
} else {
  const missingInProduction = [
    'MONGODB_URI',
    'JWT_SECRET',
    'EMAIL_SERVICE',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'EMAIL_FROM'
  ].filter((key) => !process.env[key]);

  if (parsed.data.NODE_ENV === 'production' && missingInProduction.length > 0) {
    console.warn('Missing optional production env vars:', missingInProduction.join(', '));
  }

  resolvedEnv = parsed.data;
}

export const env = resolvedEnv;
