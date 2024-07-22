import { PartialType } from '@nestjs/swagger';
import { CreateTaxiOrderDto } from './create-taxi_order.dto';

export class UpdateTaxiOrderDto extends PartialType(CreateTaxiOrderDto) {}
