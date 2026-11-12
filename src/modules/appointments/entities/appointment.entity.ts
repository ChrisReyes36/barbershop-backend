import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Barber } from '../../barbers/entities/barber.entity';
import { Service } from '../../services/entities/service.entity';
import { AppointmentStatus } from './appointment-status.enum';

// Tabla appointments: citas entre un cliente y un barbero para un servicio.
@Entity('appointments')
export class Appointment {
  // Id UUID generado por la base de datos.
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Ids de las relaciones (columnas FK).
  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'barber_id', type: 'uuid' })
  barberId: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  // Relaciones: se cargan con relations. RESTRICT impide borrar un registro con citas.
  @ApiProperty({ type: () => Customer })
  @ManyToOne(() => Customer, (customer) => customer.appointments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @ApiProperty({ type: () => Barber })
  @ManyToOne(() => Barber, (barber) => barber.appointments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'barber_id' })
  barber: Relation<Barber>;

  @ApiProperty({ type: () => Service })
  @ManyToOne(() => Service, (service) => service.appointments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  // Fecha y horas como texto (YYYY-MM-DD y HH:mm:ss) para evitar desfases de zona horaria.
  @ApiProperty({ example: '2026-11-20', description: 'Fecha (YYYY-MM-DD)' })
  @Column({ name: 'appointment_date', type: 'date' })
  appointmentDate: string;

  @ApiProperty({ example: '09:00:00', description: 'Hora de inicio' })
  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @ApiProperty({ example: '09:30:00', description: 'Hora de fin' })
  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  // Estado de la cita; por defecto "scheduled".
  @ApiProperty({
    enum: AppointmentStatus,
    enumName: 'AppointmentStatus',
    example: AppointmentStatus.SCHEDULED,
  })
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    enumName: 'appointment_status_enum',
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Cliente prefiere máquina 2',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  notes: string | null;

  // Fechas que mantiene TypeORM automáticamente.
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
