import { ApiProperty } from '@nestjs/swagger';
import { Barber } from '../entities/barber.entity';

// Info de paginación de la respuesta.
export class BarberPaginationMetaDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

// Respuesta del listado: registros + paginación (solo documentación Swagger).
export class BarberListResponseDto {
  @ApiProperty({ type: () => [Barber] })
  data: Barber[];

  @ApiProperty({ type: () => BarberPaginationMetaDto })
  meta: BarberPaginationMetaDto;
}
