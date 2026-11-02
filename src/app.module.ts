import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AppointmentsModule } from './modules/appointments/appointments.module.js';
import { BarbersModule } from './modules/barbers/barbers.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { ServicesModule } from './modules/services/services.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [HealthModule, AuthModule, AppointmentsModule, BarbersModule, CustomersModule, ServicesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
