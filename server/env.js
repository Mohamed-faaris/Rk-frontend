import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

// Load .env file from the server directory explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from 'dotenv';

// Try loading .env from server dir, then from project root
const serverEnvPath = resolve(__dirname, '.env');
const rootEnvPath = resolve(__dirname, '../.env');

if (existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config(); // fallback: load from CWD
}

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
  GOOGLE_CLIENT_ID: z.string().optional().or(z.literal('')),
  GOOGLE_CLIENT_SECRET: z.string().optional().or(z.literal('')),
  GOOGLE_REDIRECT_URI: z.string().url().optional().or(z.literal('')),
  APPLE_CLIENT_ID: z.string().optional().or(z.literal('')),
  APPLE_REDIRECT_URI: z.string().optional().or(z.literal('')),
  APPLE_SCOPES: z.string().default('name email'),
  FACEBOOK_APP_ID: z.string().optional().or(z.literal('')),
  FACEBOOK_APP_SECRET: z.string().optional().or(z.literal('')),
  FACEBOOK_GRAPH_VERSION: z.string().default('v20.0'),
  SKIP_OTP: z.string().optional().or(z.literal('')),
  CHATBOT_LLM_PROVIDER: z.string().default('auto'),
  OLLAMA_BASE_URL: z.string().optional().or(z.literal('')),
  OLLAMA_API_KEY: z.string().optional().or(z.literal('')),
  OLLAMA_MODEL: z.string().default('llama3.1'),
  OPENAI_API_KEY: z.string().optional().or(z.literal('')),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
});

const parsed = envSchema.safeParse(process.env);
let resolvedEnv;

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  resolvedEnv = { ...envSchema.parse({}), ...process.env };
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
    console.warn('⚠️  Missing production env vars:', missingInProduction.join(', '));
  }

  // Hard crash if MONGODB_URI is missing in production — this prevents silent "Database connection failed"
  if (parsed.data.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    console.error('❌ FATAL: MONGODB_URI environment variable is not set!');
    console.error('   → Go to Render Dashboard → rk-api → Environment → Add MONGODB_URI');
    process.exit(1);
  }

  resolvedEnv = parsed.data;
}

export const env = resolvedEnv;

