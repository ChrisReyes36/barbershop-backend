import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServiceQueryDto } from './dto/list-service.query.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  async findAll(query: ListServiceQueryDto): Promise<{
    data: Service[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const { page, perPage, search, isActive } = query;

    const base: FindOptionsWhere<Service> = {};
    if (isActive !== undefined) base.isActive = isActive;

    // Un arreglo en `where` es un OR entre sus elementos; `base` se repite
    // en cada uno para obtener: isActive AND (name OR description).
    const term = search?.trim();
    const where: FindOptionsWhere<Service> | FindOptionsWhere<Service>[] = term
      ? [
          { ...base, name: ILike(`%${term}%`) },
          { ...base, description: ILike(`%${term}%`) },
        ]
      : base;

    const [data, total] = await this.servicesRepository.findAndCount({
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

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  create(dto: CreateServiceDto): Promise<Service> {
    const service = this.servicesRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      durationMinutes: dto.durationMinutes,
      price: dto.price,
    });
    return this.servicesRepository.save(service);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, dto);
    return this.servicesRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const result = await this.servicesRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
  }
}
