import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment-status.enum';
import { DATE_REGEX } from './create-appointment.dto';

// Parámetros del listado (query string): paginado y filtros.
export class ListAppointmentQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Página actual' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    maximum: 100,
    description: 'Cantidad de registros por página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage: number = 10;

  @ApiPropertyOptional({
    example: 'máquina',
    description: 'Busca en las notas de la cita',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: AppointmentStatus,
    enumName: 'AppointmentStatus',
    description: 'Filtra por estado',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra por cliente' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra por barbero' })
  @IsOptional()
  @IsUUID()
  barberId?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra por servicio' })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional({
    example: '2026-11-01',
    description: 'Fecha mínima (YYYY-MM-DD), inclusive',
  })
  @IsOptional()
  @Matches(DATE_REGEX, { message: 'dateFrom must be YYYY-MM-DD' })
  @IsISO8601({ strict: true }, { message: 'dateFrom must be a valid date' })
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-11-30',
    description: 'Fecha máxima (YYYY-MM-DD), inclusive',
  })
  @IsOptional()
  @Matches(DATE_REGEX, { message: 'dateTo must be YYYY-MM-DD' })
  @IsISO8601({ strict: true }, { message: 'dateTo must be a valid date' })
  dateTo?: string;
}
