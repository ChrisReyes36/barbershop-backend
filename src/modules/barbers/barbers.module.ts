import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarbersController } from './barbers.controller';
import { BarbersService } from './barbers.service';
import { Barber } from './entities/barber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barber])],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
