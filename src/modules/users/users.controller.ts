import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

// Endpoints de usuarios (requieren token).
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users: lista todos los usuarios.
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
