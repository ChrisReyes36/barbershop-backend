import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// Lógica de usuarios.
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  // Lista todos los usuarios (sin el hash de la contraseña).
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Busca por email e incluye el hash de la contraseña (oculto por defecto).
  // Solo para autenticación.
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.toLocaleLowerCase().trim() })
      .getOne();
  }
}
