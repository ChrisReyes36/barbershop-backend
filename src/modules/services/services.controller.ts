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
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServiceQueryDto } from './dto/list-service.query.dto';
import { ServiceListResponseDto } from './dto/service-list-response.dto';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar servicios con paginado y filtros' })
  @ApiOkResponse({ type: ServiceListResponseDto })
  @ApiBadRequestResponse({ description: 'Parámetros de consulta inválidos' })
  findAll(@Query() query: ListServiceQueryDto) {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un servicio por id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Service })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Servicio no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un servicio' })
  @ApiCreatedResponse({ type: Service })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(@Body() dto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un servicio' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Service })
  @ApiBadRequestResponse({ description: 'Datos o id inválidos' })
  @ApiNotFoundResponse({ description: 'Servicio no encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un servicio' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Servicio eliminado' })
  @ApiConflictResponse({ description: 'El servicio tiene citas asociadas' })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Servicio no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.servicesService.remove(id);
  }
}
