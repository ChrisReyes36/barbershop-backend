import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Contenido del token firmado en el login.
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// Lo que queda en request.user cuando el token es válido.
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

// Estrategia que valida el token JWT del header Authorization: Bearer.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // rechaza tokens vencidos
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Se ejecuta tras verificar firma y expiración; el resultado va a request.user.
  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
