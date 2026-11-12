import { PartialType } from '@nestjs/swagger';
import { CreateBarberDto } from './create-barber.dto';

// Datos para actualizar: igual que crear, pero todos los campos son opcionales.
export class UpdateBarberDto extends PartialType(CreateBarberDto) {}
