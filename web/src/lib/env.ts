import { z } from 'zod';
import { logger } from './logger';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

logger.info('API URL:', import.meta.env.VITE_API_URL);

export const env = parsed.data;
