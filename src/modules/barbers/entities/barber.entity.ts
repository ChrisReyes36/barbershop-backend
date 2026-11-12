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

// Tabla barbers: barberos.
@Entity('barbers')
export class Barber {
  // Id UUID generado por la base de datos.
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Carlos Ramírez' })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({ type: String, nullable: true, example: 'carlos@correo.com' })
  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  email: string | null;

  @ApiProperty({ type: String, nullable: true, example: '+503 7000 0000' })
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'Fade y barba' })
  @Column({ type: 'varchar', length: 80, nullable: true })
  specialty: string | null;

  // Estado: false = desactivado (se usa como filtro en el listado).
  @ApiProperty({ example: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Fechas que mantiene TypeORM automáticamente.
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Citas de este barbero (lado inverso de Appointment.barber).
  @OneToMany(() => Appointment, (appointment) => appointment.barber)
  appointments: Appointment[];
}
