import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  ILike,
  In,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentStatus } from './entities/appointment-status.enum';
import { Customer } from '../customers/entities/customer.entity';
import { Barber } from '../barbers/entities/barber.entity';
import { Service } from '../services/entities/service.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ListAppointmentQueryDto } from './dto/list-appointment.query.dto';

// Estados que ocupan el horario del barbero.
const BLOCKING_STATUSES = [
  AppointmentStatus.SCHEDULED,
  AppointmentStatus.COMPLETED,
];

const RELATIONS = { customer: true, barber: true, service: true };

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    @InjectRepository(Barber)
    private readonly barbersRepository: Repository<Barber>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  async findAll(query: ListAppointmentQueryDto): Promise<{
    data: Appointment[];
    meta: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const {
      page,
      perPage,
      search,
      status,
      customerId,
      barberId,
      serviceId,
      dateFrom,
      dateTo,
    } = query;

    const where: FindOptionsWhere<Appointment> = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (barberId) where.barberId = barberId;
    if (serviceId) where.serviceId = serviceId;

    if (dateFrom && dateTo) {
      where.appointmentDate = Between(dateFrom, dateTo);
    } else if (dateFrom) {
      where.appointmentDate = MoreThanOrEqual(dateFrom);
    } else if (dateTo) {
      where.appointmentDate = LessThanOrEqual(dateTo);
    }

    const term = search?.trim();
    if (term) where.notes = ILike(`%${term}%`);

    const [data, total] = await this.appointmentsRepository.findAndCount({
      where,
      relations: RELATIONS,
      order: { appointmentDate: 'DESC', startTime: 'ASC' },
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

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: RELATIONS,
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return appointment;
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const startTime = this.normalizeTime(dto.startTime);
    const endTime = this.normalizeTime(dto.endTime);

    this.assertTimeRange(startTime, endTime);
    await this.assertReferences(dto.customerId, dto.barberId, dto.serviceId);
    await this.assertBarberAvailable({
      barberId: dto.barberId,
      appointmentDate: dto.appointmentDate,
      startTime,
      endTime,
    });

    const appointment = this.appointmentsRepository.create({
      customerId: dto.customerId,
      barberId: dto.barberId,
      serviceId: dto.serviceId,
      appointmentDate: dto.appointmentDate,
      startTime,
      endTime,
      notes: dto.notes ?? null,
    });
    const saved = await this.appointmentsRepository.save(appointment);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    // Se carga sin relaciones: si estuvieran cargadas, `save` daría prioridad
    // al objeto relacionado y no al nuevo `customerId`/`barberId`/`serviceId`.
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    const customerId = dto.customerId ?? appointment.customerId;
    const barberId = dto.barberId ?? appointment.barberId;
    const serviceId = dto.serviceId ?? appointment.serviceId;
    const appointmentDate = dto.appointmentDate ?? appointment.appointmentDate;
    const startTime = this.normalizeTime(
      dto.startTime ?? appointment.startTime,
    );
    const endTime = this.normalizeTime(dto.endTime ?? appointment.endTime);
    const status = dto.status ?? appointment.status;

    this.assertTimeRange(startTime, endTime);

    if (
      customerId !== appointment.customerId ||
      barberId !== appointment.barberId ||
      serviceId !== appointment.serviceId
    ) {
      await this.assertReferences(
        customerId !== appointment.customerId ? customerId : undefined,
        barberId !== appointment.barberId ? barberId : undefined,
        serviceId !== appointment.serviceId ? serviceId : undefined,
      );
    }

    if (BLOCKING_STATUSES.includes(status)) {
      await this.assertBarberAvailable({
        barberId,
        appointmentDate,
        startTime,
        endTime,
        excludeId: id,
      });
    }

    Object.assign(appointment, {
      customerId,
      barberId,
      serviceId,
      appointmentDate,
      startTime,
      endTime,
      status,
      notes: dto.notes ?? appointment.notes,
    });
    await this.appointmentsRepository.save(appointment);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
  }

  /** Acepta `HH:mm` o `HH:mm:ss` y devuelve siempre `HH:mm:ss`. */
  private normalizeTime(time: string): string {
    return time.length === 5 ? `${time}:00` : time;
  }

  private assertTimeRange(startTime: string, endTime: string): void {
    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }
  }

  /** Verifica que existan (404) y estén activos (400) los ids indicados. */
  private async assertReferences(
    customerId?: string,
    barberId?: string,
    serviceId?: string,
  ): Promise<void> {
    if (customerId) {
      const customer = await this.customersRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with id ${customerId} not found`);
      }
      if (!customer.isActive) {
        throw new BadRequestException('Customer is not active');
      }
    }

    if (barberId) {
      const barber = await this.barbersRepository.findOne({
        where: { id: barberId },
      });
      if (!barber) {
        throw new NotFoundException(`Barber with id ${barberId} not found`);
      }
      if (!barber.isActive) {
        throw new BadRequestException('Barber is not active');
      }
    }

    if (serviceId) {
      const service = await this.servicesRepository.findOne({
        where: { id: serviceId },
      });
      if (!service) {
        throw new NotFoundException(`Service with id ${serviceId} not found`);
      }
      if (!service.isActive) {
        throw new BadRequestException('Service is not active');
      }
    }
  }

  /** Lanza 409 si el barbero ya tiene una cita que se cruza con el horario. */
  private async assertBarberAvailable(params: {
    barberId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    excludeId?: string;
  }): Promise<void> {
    const { barberId, appointmentDate, startTime, endTime, excludeId } = params;

    const overlaps = await this.appointmentsRepository.exists({
      where: {
        barberId,
        appointmentDate,
        status: In(BLOCKING_STATUSES),
        // Dos rangos se cruzan si cada uno empieza antes de que termine el otro.
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });
    if (overlaps) {
      throw new ConflictException(
        'The barber already has an appointment in that time range',
      );
    }
  }
}
