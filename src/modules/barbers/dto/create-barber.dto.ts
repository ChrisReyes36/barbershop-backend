import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// Datos para crear un barbero.
export class CreateBarberDto {
  @ApiProperty({ example: 'Carlos Ramírez', description: 'Nombre del barbero' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 'carlos@correo.com',
    description: 'Correo electrónico (único)',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({
    example: '+503 7000 0000',
    description: 'Teléfono del barbero',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Fade y barba',
    description: 'Especialidad del barbero',
  })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  specialty?: string;
}
