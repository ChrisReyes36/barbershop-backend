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
import { ListCustomerQueryDto } from './dto/list-customer.query.dto';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerListResponseDto } from './dto/customer-list-response.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar clientes con paginado y filtros' })
  @ApiOkResponse({ type: CustomerListResponseDto })
  @ApiBadRequestResponse({ description: 'Parámetros de consulta inválidos' })
  findAll(@Query() query: ListCustomerQueryDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Customer })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un cliente' })
  @ApiCreatedResponse({ type: Customer })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiConflictResponse({ description: 'El email ya está en uso' })
  create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: Customer })
  @ApiBadRequestResponse({ description: 'Datos o id inválidos' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @ApiConflictResponse({ description: 'El email ya está en uso' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Cliente eliminado' })
  @ApiConflictResponse({ description: 'El cliente tiene citas asociadas' })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
