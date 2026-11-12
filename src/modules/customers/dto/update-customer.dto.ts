import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

// Datos para actualizar: igual que crear, pero todos los campos son opcionales.
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
