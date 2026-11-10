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

@Entity('appointments')
export class Appointment {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'barber_id', type: 'uuid' })
  barberId: string;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

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

  @ApiProperty({ example: '2026-11-20', description: 'Fecha (YYYY-MM-DD)' })
  @Column({ name: 'appointment_date', type: 'date' })
  appointmentDate: string;

  @ApiProperty({ example: '09:00:00', description: 'Hora de inicio' })
  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @ApiProperty({ example: '09:30:00', description: 'Hora de fin' })
  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

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

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
