import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../entities/service.entity';

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

export class ServiceListResponseDto {
  @ApiProperty({ type: () => [Service] })
  data: Service[];

  @ApiProperty({ type: () => ServicePaginationMetaDto })
  meta: ServicePaginationMetaDto;
}
