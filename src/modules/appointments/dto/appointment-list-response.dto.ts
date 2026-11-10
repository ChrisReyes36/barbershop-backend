import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../entities/appointment.entity';

export class AppointmentPaginationMetaDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  perPage: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class AppointmentListResponseDto {
  @ApiProperty({ type: () => [Appointment] })
  data: Appointment[];

  @ApiProperty({ type: () => AppointmentPaginationMetaDto })
  meta: AppointmentPaginationMetaDto;
}
