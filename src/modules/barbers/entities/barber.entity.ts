import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('barbers')
export class Barber {
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

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
