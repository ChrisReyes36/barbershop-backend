import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Datos para crear un cliente.
export class CreateCustomerDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'juan@correo.com',
    description: 'Correo electrónico (único)',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '+503 7000 0000',
    description: 'Teléfono del cliente',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
