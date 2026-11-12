import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Crea la tabla users (usuarios del sistema).
export class CreateUserTable1793692607033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita gen_random_uuid() para los ids.
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            isNullable: false,
          },
          {
            name: 'role', // p. ej. 'admin'
            type: 'varchar',
            length: '50',
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
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        // Email único.
        uniques: [
          {
            name: 'UQ_users_email',
            columnNames: ['email'],
          },
        ],
      }),
    );
  }

  // Revierte la migración.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
