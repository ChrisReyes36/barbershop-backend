import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../entities/service.entity';

// Info de paginación de la respuesta.
export class ServicePaginationMetaDto {
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
export class ServiceListResponseDto {
  @ApiProperty({ type: () => [Service] })
  data: Service[];

  @ApiProperty({ type: () => ServicePaginationMetaDto })
  meta: ServicePaginationMetaDto;
}
