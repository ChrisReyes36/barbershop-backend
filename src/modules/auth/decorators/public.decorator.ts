import { SetMetadata } from '@nestjs/common';

// Clave del metadato que lee el guard.
export const IS_PUBLIC_KEY = 'isPublic';

/** Marca una ruta o controlador como público: el guard global no exige token. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
