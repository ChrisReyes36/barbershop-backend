import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Crea la tabla appointments (citas) con sus relaciones.
export class CreateAppointmentsTable1794340172232 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita gen_random_uuid() para los ids.
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'barber_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'service_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'appointment_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'start_time',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'status', // estado de la cita, por defecto 'scheduled'
            type: 'enum',
            enumName: 'appointment_status_enum',
            enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
            default: "'scheduled'",
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
        // Una cita no deja borrar su cliente, barbero ni servicio (RESTRICT).
        foreignKeys: [
          {
            name: 'FK_appointments_customer',
            columnNames: ['customer_id'],
            referencedTableName: 'customers',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_appointments_barber',
            columnNames: ['barber_id'],
            referencedTableName: 'barbers',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_appointments_service',
            columnNames: ['service_id'],
            referencedTableName: 'services',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
        // Índices para filtrar por cada relación y buscar la agenda de un barbero.
        indices: [
          {
            name: 'IDX_appointments_customer_id',
            columnNames: ['customer_id'],
          },
          {
            name: 'IDX_appointments_barber_id',
            columnNames: ['barber_id'],
          },
          {
            name: 'IDX_appointments_service_id',
            columnNames: ['service_id'],
          },
          {
            name: 'IDX_appointments_barber_date',
            columnNames: ['barber_id', 'appointment_date'],
          },
        ],
        // La hora de fin debe ser posterior a la de inicio.
        checks: [
          {
            name: 'CHK_appointments_time_range',
            expression: '"end_time" > "start_time"',
          },
        ],
      }),
    );
  }

  // Revierte la migración.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
    // dropTable no elimina el tipo enum de Postgres, se borra aparte.
    await queryRunner.query('DROP TYPE IF EXISTS "appointment_status_enum";');
  }
}
