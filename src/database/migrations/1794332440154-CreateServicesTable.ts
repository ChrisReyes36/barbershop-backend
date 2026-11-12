import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Crea la tabla services (servicios que ofrece la barbería).
export class CreateServicesTable1794332440154 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita gen_random_uuid() para los ids.
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryRunner.createTable(
      new Table({
        name: 'services',
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
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'duration_minutes', // duración en minutos
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'price', // dinero: numeric evita errores de redondeo
            type: 'numeric',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isArray: false,
            default: true,
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
      }),
    );
  }

  // Revierte la migración.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('services');
  }
}
