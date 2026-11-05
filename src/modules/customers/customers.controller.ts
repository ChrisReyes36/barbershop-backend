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
import { ListCustomerQueryDto } from './dto/list-customer.query.dto';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query() query: ListCustomerQueryDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customersService.remove(id);
  }
}
