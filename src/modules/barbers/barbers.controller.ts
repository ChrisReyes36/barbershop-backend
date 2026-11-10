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
import { BarbersService } from './barbers.service';
import { Barber } from './entities/barber.entity';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { ListBarberQueryDto } from './dto/list-barber.query.dto';
import { BarberListResponseDto } from './dto/barber-list-response.dto';

@ApiTags('Barbers')
@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar barberos con paginado y filtros' })
  @ApiOkResponse({ type: BarberListResponseDto })
  @ApiBadRequestResponse({ description: 'Parámetros de consulta inválidos' })
  findAll(@Query() query: ListBarberQueryDto) {
    return this.barbersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un barbero por id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Barber })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Barbero no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Barber> {
    return this.barbersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un barbero' })
  @ApiCreatedResponse({ type: Barber })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiConflictResponse({ description: 'El email ya está en uso' })
  create(@Body() dto: CreateBarberDto): Promise<Barber> {
    return this.barbersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un barbero' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Barber })
  @ApiBadRequestResponse({ description: 'Datos o id inválidos' })
  @ApiNotFoundResponse({ description: 'Barbero no encontrado' })
  @ApiConflictResponse({ description: 'El email ya está en uso' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBarberDto,
  ): Promise<Barber> {
    return this.barbersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un barbero' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Barbero eliminado' })
  @ApiConflictResponse({ description: 'El barbero tiene citas asociadas' })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Barbero no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.barbersService.remove(id);
  }
}
