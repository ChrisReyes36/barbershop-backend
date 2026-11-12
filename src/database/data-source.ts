import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { validateEnv } from '../config/env/validation';

const env = validateEnv(process.env as Record<string, unknown>);

// DataSource para la CLI de TypeORM (migraciones) y el seed, fuera de Nest.
export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: ['error'],
});
