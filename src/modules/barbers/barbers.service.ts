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

@Injectable()
export class BarbersService {
  constructor(
    @InjectRepository(Barber)
    private readonly barbersRepository: Repository<Barber>,
  ) {}

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

    const base: FindOptionsWhere<Barber> = {};
    if (isActive !== undefined) base.isActive = isActive;

    const term = search?.trim();
    const where: FindOptionsWhere<Barber> | FindOptionsWhere<Barber>[] = term
      ? [
          { ...base, name: ILike(`%${term}%`) },
          { ...base, email: ILike(`%${term}%`) },
          { ...base, phone: ILike(`%${term}%`) },
          { ...base, specialty: ILike(`%${term}%`) },
        ]
      : base;

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

  async findOne(id: string): Promise<Barber> {
    const barber = await this.barbersRepository.findOne({ where: { id } });
    if (!barber) {
      throw new NotFoundException(`Barber with id ${id} not found`);
    }
    return barber;
  }

  async create(dto: CreateBarberDto): Promise<Barber> {
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

  async update(id: string, dto: UpdateBarberDto): Promise<Barber> {
    const barber = await this.findOne(id);

    if (dto.email && dto.email !== barber.email) {
      await this.assertEmailAvailable(dto.email);
    }

    Object.assign(barber, dto);
    return this.barbersRepository.save(barber);
  }

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

  private async assertEmailAvailable(email: string): Promise<void> {
    const emailTaken = await this.barbersRepository.exists({
      where: { email },
    });
    if (emailTaken) {
      throw new ConflictException(`Email ${email} is already in use`);
    }
  }
}
