import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ListCustomerQueryDto } from './dto/list-customer.query.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

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

    const base: FindOptionsWhere<Customer> = {};
    if (isActive !== undefined) base.isActive = isActive;

    const term = search?.trim();
    const where: FindOptionsWhere<Customer> | FindOptionsWhere<Customer>[] =
      term
        ? [
            { ...base, name: ILike(`%${term}%`) },
            { ...base, email: ILike(`%${term}%`) },
            { ...base, phone: ILike(`%${term}%`) },
          ]
        : base;

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

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    if (dto.email && dto.email !== customer.email) {
      const emailTaken = await this.customersRepository.exists({
        where: { email: dto.email },
      });
      if (emailTaken) {
        throw new ConflictException(`Email ${dto.email} is already in use`);
      }
    }

    Object.assign(customer, dto);
    return this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
  }

  create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create({
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
    });
    return this.customersRepository.save(customer);
  }
}
