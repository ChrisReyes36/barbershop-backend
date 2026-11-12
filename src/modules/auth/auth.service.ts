import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

// Lógica de autenticación.
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Verifica email y contraseña y devuelve un token JWT.
  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    // La contraseña está hasheada: se compara con bcrypt, no se filtra en SQL.
    const passwordMatches =
      !!user && (await bcrypt.compare(dto.password, user.password));

    // Mismo error para email inexistente, contraseña errónea o usuario inactivo.
    if (!user || !passwordMatches || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Datos que viajan dentro del token.
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
