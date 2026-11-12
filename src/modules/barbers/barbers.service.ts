import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { isForeignKeyViolation } from '../../common/database/pg-errors';
import { Barber } from './entities/barber.entity';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { ListBarberQueryDto } from './dto/list-barber.query.dto';

// Lógica de negocio de barberos.
@Injectable()
export class BarbersService {
  constructor(
    @InjectRepository(Barber)
    private readonly barbersRepository: Repository<Barber>,
  ) {}

  // Lista paginada: filtra por estado y busca por nombre, email, teléfono o especialidad.
  async findAll(query: ListBarberQueryDto): Promise<{
    data: Barber[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const { page, perPage, search, isActive } = query;

    // Filtro opcional por estado activo/inactivo.
    const base: FindOptionsWhere<Barber> = {};
    if (isActive !== undefined) base.isActive = isActive;

    // Con búsqueda: estado AND (cada campo ILIKE). Un arreglo en where es un OR.
    const term = search?.trim();
    const where: FindOptionsWhere<Barber> | FindOptionsWhere<Barber>[] = term
      ? [
          { ...base, name: ILike(`%${term}%`) },
          { ...base, email: ILike(`%${term}%`) },
          { ...base, phone: ILike(`%${term}%`) },
          { ...base, specialty: ILike(`%${term}%`) },
        ]
      : base;

    // Trae la página pedida y el total de registros.
    const [data, total] = await this.barbersRepository.findAndCount({
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
  async findOne(id: string): Promise<Barber> {
    const barber = await this.barbersRepository.findOne({ where: { id } });
    if (!barber) {
      throw new NotFoundException(`Barber with id ${id} not found`);
    }
    return barber;
  }

  // Crea un barbero.
  async create(dto: CreateBarberDto): Promise<Barber> {
    // Verifica que el email no esté en uso.
    if (dto.email) {
      await this.assertEmailAvailable(dto.email);
    }

    const barber = this.barbersRepository.create({
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      specialty: dto.specialty ?? null,
    });
    return this.barbersRepository.save(barber);
  }

  // Actualiza un barbero; lanza 404 si no existe.
  async update(id: string, dto: UpdateBarberDto): Promise<Barber> {
    const barber = await this.findOne(id);

    // Solo valida el email si cambió.
    if (dto.email && dto.email !== barber.email) {
      await this.assertEmailAvailable(dto.email);
    }

    // Aplica solo los campos recibidos.
    Object.assign(barber, dto);
    return this.barbersRepository.save(barber);
  }

  // Elimina por id: 404 si no existe, 409 si tiene citas asociadas.
  async remove(id: string): Promise<void> {
    let result: DeleteResult;
    try {
      result = await this.barbersRepository.delete(id);
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          'Barber has appointments and cannot be deleted',
        );
      }
      throw error;
    }
    if (!result.affected) {
      throw new NotFoundException(`Barber with id ${id} not found`);
    }
  }

  // Lanza 409 si el email ya lo usa otro registro.
  private async assertEmailAvailable(email: string): Promise<void> {
    const emailTaken = await this.barbersRepository.exists({
      where: { email },
    });
    if (emailTaken) {
      throw new ConflictException(`Email ${email} is already in use`);
    }
  }
}
