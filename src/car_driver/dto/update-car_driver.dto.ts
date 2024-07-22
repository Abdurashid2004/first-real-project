import { PartialType } from '@nestjs/swagger';
import { CreateCarDriverDto } from './create-car_driver.dto';

export class UpdateCarDriverDto extends PartialType(CreateCarDriverDto) {}
