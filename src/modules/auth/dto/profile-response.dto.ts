import { ApiProperty } from '@nestjs/swagger';

// Datos del usuario autenticado (salen del token, no de la base de datos).
export class ProfileResponseDto {
  @ApiProperty({ format: 'uuid', description: 'Id del usuario' })
  userId: string;

  @ApiProperty({ example: 'admin@barbershop.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}
