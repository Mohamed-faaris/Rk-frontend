import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

console.log('API URL:', import.meta.env.VITE_API_URL);

export const env = parsed.data;
