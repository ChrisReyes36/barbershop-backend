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

// Tabla customers: clientes.
@Entity('customers')
export class Customer {
  // Id UUID generado por la base de datos.
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ApiProperty({ type: String, nullable: true, example: 'juan@correo.com' })
  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  email: string | null;

  @ApiProperty({ type: String, nullable: true, example: '+503 7000 0000' })
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

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

  // Citas de este cliente (lado inverso de Appointment.customer).
  @OneToMany(() => Appointment, (appointment) => appointment.customer)
  appointments: Appointment[];
}
