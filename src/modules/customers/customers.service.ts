import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { DeleteResult, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { isForeignKeyViolation } from '../../common/database/pg-errors';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ListCustomerQueryDto } from './dto/list-customer.query.dto';

// Lógica de negocio de clientes.
@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  // Lista paginada: filtra por estado y busca por nombre, email o teléfono.
  async findAll(query: ListCustomerQueryDto): Promise<{
    data: Customer[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const { page, perPage, search, isActive } = query;

    // Filtro opcional por estado activo/inactivo.
    const base: FindOptionsWhere<Customer> = {};
    if (isActive !== undefined) base.isActive = isActive;

    // Con búsqueda: estado AND (cada campo ILIKE). Un arreglo en where es un OR.
    const term = search?.trim();
    const where: FindOptionsWhere<Customer> | FindOptionsWhere<Customer>[] =
      term
        ? [
            { ...base, name: ILike(`%${term}%`) },
            { ...base, email: ILike(`%${term}%`) },
            { ...base, phone: ILike(`%${term}%`) },
          ]
        : base;

    // Trae la página pedida y el total de registros.
    const [data, total] = await this.customersRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      data,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  // Busca por id; lanza 404 si no existe.
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  // Actualiza un cliente; lanza 404 si no existe.
  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    // Solo valida el email si cambió.
    if (dto.email && dto.email !== customer.email) {
      await this.assertEmailAvailable(dto.email);
    }

    // Aplica solo los campos recibidos.
    Object.assign(customer, dto);
    return this.customersRepository.save(customer);
  }

  // Elimina por id: 404 si no existe, 409 si tiene citas asociadas.
  async remove(id: string): Promise<void> {
    let result: DeleteResult;
    try {
      result = await this.customersRepository.delete(id);
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          'Customer has appointments and cannot be deleted',
        );
      }
      throw error;
    }
    if (!result.affected) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
  }

  // Crea un cliente.
  async create(dto: CreateCustomerDto): Promise<Customer> {
    // Verifica que el email no esté en uso.
    if (dto.email) {
      await this.assertEmailAvailable(dto.email);
    }

    const customer = this.customersRepository.create({
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
    });
    return this.customersRepository.save(customer);
  }

  // Lanza 409 si el email ya lo usa otro registro.
  private async assertEmailAvailable(email: string): Promise<void> {
    const emailTaken = await this.customersRepository.exists({
      where: { email },
    });
    if (emailTaken) {
      throw new ConflictException(`Email ${email} is already in use`);
    }
  }
}
