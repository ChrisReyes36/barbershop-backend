import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { isForeignKeyViolation } from '../../common/database/pg-errors';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServiceQueryDto } from './dto/list-service.query.dto';

// Lógica de negocio de servicios.
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  // Lista paginada: filtra por estado y busca por nombre o descripción.
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

    // Filtro opcional por estado activo/inactivo.
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

    // Trae la página pedida y el total de registros.
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

  // Busca por id; lanza 404 si no existe.
  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  // Crea un servicio.
  create(dto: CreateServiceDto): Promise<Service> {
    const service = this.servicesRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      durationMinutes: dto.durationMinutes,
      price: dto.price,
    });
    return this.servicesRepository.save(service);
  }

  // Actualiza un servicio; lanza 404 si no existe.
  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    // Aplica solo los campos recibidos.
    Object.assign(service, dto);
    return this.servicesRepository.save(service);
  }

  // Elimina por id: 404 si no existe, 409 si tiene citas asociadas.
  async remove(id: string): Promise<void> {
    let result: DeleteResult;
    try {
      result = await this.servicesRepository.delete(id);
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          'Service has appointments and cannot be deleted',
        );
      }
      throw error;
    }
    if (!result.affected) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
  }
}
