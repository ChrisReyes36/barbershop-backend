import { QueryFailedError } from 'typeorm';

/** Código de error de Postgres para violación de clave foránea. */
const PG_FOREIGN_KEY_VIOLATION = '23503';

/** `true` si el error viene de borrar/actualizar una fila que otra tabla referencia. */
export function isForeignKeyViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string }).code === PG_FOREIGN_KEY_VIOLATION
  );
}
