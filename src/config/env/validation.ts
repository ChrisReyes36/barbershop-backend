import { z } from 'zod';

// Variables de entorno requeridas, con su tipo y valores por defecto.
const envSchema = z.object({
  APP_PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  JWT_SECRET: z.string().min(32), // clave para firmar tokens
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(3600), // segundos
});

export type EnvVars = z.infer<typeof envSchema>;

// Valida el entorno al arrancar; si falta algo, detiene la app con el detalle.
export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${formatted}`);
  }

  return result.data;
}
