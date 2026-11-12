import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Crea la tabla barbers (barberos).
export class CreateBarbersTable1794324311907 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita gen_random_uuid() para los ids.
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryRunner.createTable(
      new Table({
        name: 'barbers',
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
            name: 'email',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          {
            name: 'specialty',
            type: 'varchar',
            length: '80',
            isNullable: true,
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
        // Email único.
        uniques: [
          {
            name: 'UQ_barbers_email',
            columnNames: ['email'],
          },
        ],
      }),
    );
  }

  // Revierte la migración.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('barbers');
  }
}
