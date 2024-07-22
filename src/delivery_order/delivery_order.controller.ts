import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryOrderService } from './delivery_order.service';
import { CreateDeliveryOrderDto } from './dto/create-delivery_order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery_order.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Delivery-Order")
@Controller('delivery-order')
export class DeliveryOrderController {
  constructor(private readonly deliveryOrderService: DeliveryOrderService) {}

  @Post()
  create(@Body() createDeliveryOrderDto: CreateDeliveryOrderDto) {
    return this.deliveryOrderService.create(createDeliveryOrderDto);
  }

  @Get()
  findAll() {
    return this.deliveryOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliveryOrderDto: UpdateDeliveryOrderDto) {
    return this.deliveryOrderService.update(+id, updateDeliveryOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryOrderService.remove(+id);
  }
}
