import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@barbershop.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: 'MiContraseña123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}
