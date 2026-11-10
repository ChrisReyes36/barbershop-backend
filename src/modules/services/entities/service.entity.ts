import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('services')
export class Service {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Corte de cabello' })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Corte clásico con acabado a navaja',
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ example: 30, description: 'Duración en minutos' })
  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes: number;

  @ApiProperty({ example: 8.5 })
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    // `numeric` llega como string desde Postgres; se convierte a number.
    transformer: {
      to: (value?: number) => value,
      from: (value: string | null) =>
        value === null ? null : parseFloat(value),
    },
  })
  price: number;

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
