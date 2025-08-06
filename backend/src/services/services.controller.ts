import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Service, ServiceCategory } from '../common/entities';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  findAll(@Query('category') category?: ServiceCategory) {
    if (category) {
      return this.servicesService.findByCategory(category);
    }
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by id' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new service' })
  create(@Body() createServiceDto: Partial<Service>) {
    return this.servicesService.create(createServiceDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update service' })
  update(@Param('id') id: string, @Body() updateServiceDto: Partial<Service>) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
} 