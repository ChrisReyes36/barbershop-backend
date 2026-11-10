import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { BarbersModule } from './modules/barbers/barbers.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from './config/env/validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmOptions } from './config/database/typeorm.config';

@Module({
  imports: [
    // Env y config global
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    // Config DB
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService),
    }),
    // App modules
    HealthModule,
    AuthModule,
    AppointmentsModule,
    BarbersModule,
    CustomersModule,
    ServicesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
