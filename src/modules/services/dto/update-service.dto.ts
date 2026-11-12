import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

// Datos para actualizar: igual que crear, pero todos los campos son opcionales.
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
