import { IsInt, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDriverDto {
  @ApiProperty({
    description: "The unique identifier for the driver",
    example: 1,
  })
  @IsInt()
  driver_id: number;

  @ApiProperty({
    description: "The unique identifier for the car",
    example: 1,
  })
  @IsInt()
  car_id: number;
}