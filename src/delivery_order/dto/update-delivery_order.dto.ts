import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryOrderDto } from './create-delivery_order.dto';

export class UpdateDeliveryOrderDto extends PartialType(CreateDeliveryOrderDto) {}
