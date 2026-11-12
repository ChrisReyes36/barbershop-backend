import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

// Formatos aceptados: fecha YYYY-MM-DD y hora HH:mm o HH:mm:ss.
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

// Datos para crear una cita.
export class CreateAppointmentDto {
  @ApiProperty({ format: 'uuid', description: 'Id del cliente' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ format: 'uuid', description: 'Id del barbero' })
  @IsUUID()
  barberId: string;

  @ApiProperty({ format: 'uuid', description: 'Id del servicio' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '2026-11-20', description: 'Fecha (YYYY-MM-DD)' })
  @Matches(DATE_REGEX, { message: 'appointmentDate must be YYYY-MM-DD' })
  @IsISO8601(
    { strict: true },
    { message: 'appointmentDate must be a valid date' },
  )
  appointmentDate: string;

  @ApiProperty({ example: '09:00', description: 'Hora de inicio (HH:mm)' })
  @Matches(TIME_REGEX, { message: 'startTime must be HH:mm or HH:mm:ss' })
  startTime: string;

  @ApiProperty({ example: '09:30', description: 'Hora de fin (HH:mm)' })
  @Matches(TIME_REGEX, { message: 'endTime must be HH:mm or HH:mm:ss' })
  endTime: string;

  @ApiPropertyOptional({
    example: 'Cliente prefiere máquina 2',
    description: 'Notas de la cita',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}
