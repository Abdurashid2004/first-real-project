import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaxiOrderService } from './taxi_order.service';
import { CreateTaxiOrderDto } from './dto/create-taxi_order.dto';
import { UpdateTaxiOrderDto } from './dto/update-taxi_order.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('TaxiOrder')
@Controller('taxi-order')
export class TaxiOrderController {
  constructor(private readonly taxiOrderService: TaxiOrderService) {}

  @Post()
  create(@Body() createTaxiOrderDto: CreateTaxiOrderDto) {
    return this.taxiOrderService.create(createTaxiOrderDto);
  }

  @Get()
  findAll() {
    return this.taxiOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxiOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxiOrderDto: UpdateTaxiOrderDto) {
    return this.taxiOrderService.update(+id, updateTaxiOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxiOrderService.remove(+id);
  }
}
