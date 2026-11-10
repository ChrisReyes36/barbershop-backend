import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Corte de cabello',
    description: 'Nombre del servicio',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 'Corte clásico con acabado a navaja',
    description: 'Descripción del servicio',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 30, minimum: 1, description: 'Duración en minutos' })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({
    example: 8.5,
    minimum: 0,
    description: 'Precio del servicio (hasta 2 decimales)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  price: number;
}
