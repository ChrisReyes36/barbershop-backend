import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

// Agrega la columna password (hash) a users.
export class AddPasswordToUsers1794498315264 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'password',
        type: 'varchar',
        length: '255',
        isNullable: false,
      }),
    );
  }

  // Revierte la migración.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'password');
  }
}
