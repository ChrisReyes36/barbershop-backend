import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../entities/customer.entity';

// Info de paginación de la respuesta.
export class PaginationMetaDto {
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
export class CustomerListResponseDto {
  @ApiProperty({ type: () => [Customer] })
  data: Customer[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
