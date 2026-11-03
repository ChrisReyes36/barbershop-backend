import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createTypeOrmOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const host = configService.getOrThrow<string>('DB_HOST');
  const port = configService.getOrThrow<number>('DB_PORT');
  const username = configService.getOrThrow<string>('DB_USER');
  const password = configService.getOrThrow<string>('DB_PASSWORD');
  const database = configService.getOrThrow<string>('DB_NAME');
  const useSsl = configService.getOrThrow<boolean>('DB_SSL');

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    applicationName: 'barbershop-api',
    synchronize: false,
    autoLoadEntities: true,
    logging: ['error', 'schema', 'warn', 'query'],
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  };
}
