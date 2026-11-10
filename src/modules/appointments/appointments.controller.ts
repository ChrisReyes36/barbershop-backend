import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ListAppointmentQueryDto } from './dto/list-appointment.query.dto';
import { AppointmentListResponseDto } from './dto/appointment-list-response.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar citas con paginado y filtros' })
  @ApiOkResponse({ type: AppointmentListResponseDto })
  @ApiBadRequestResponse({ description: 'Parámetros de consulta inválidos' })
  findAll(@Query() query: ListAppointmentQueryDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita por id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Appointment })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Cita no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una cita' })
  @ApiCreatedResponse({ type: Appointment })
  @ApiBadRequestResponse({
    description: 'Datos inválidos, horario incorrecto o referencia inactiva',
  })
  @ApiNotFoundResponse({ description: 'Cliente, barbero o servicio no existe' })
  @ApiConflictResponse({
    description: 'El barbero ya tiene una cita en ese horario',
  })
  create(@Body() dto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita (incluido su estado)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Appointment })
  @ApiBadRequestResponse({
    description: 'Datos inválidos, horario incorrecto o referencia inactiva',
  })
  @ApiNotFoundResponse({
    description: 'Cita, cliente, barbero o servicio no existe',
  })
  @ApiConflictResponse({
    description: 'El barbero ya tiene una cita en ese horario',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Cita eliminada' })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Cita no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.appointmentsService.remove(id);
  }
}
