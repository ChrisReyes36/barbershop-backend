import { Controller } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

// Chequeo de estado de la app; público (sin token). Aún sin endpoints.
@Public()
@Controller('health')
export class HealthController {}
