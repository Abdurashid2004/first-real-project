import {
  IsString,
  IsInt,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeliveryOrderDto {
  @ApiProperty({ example: 1, description: "ID of the starting district" })
  @IsInt()
  @IsNotEmpty()
  from_district_id: number;

  @ApiProperty({ example: 2, description: "ID of the destination district" })
  @IsInt()
  @IsNotEmpty()
  to_district_id: number;

  @ApiProperty({ example: "2023-07-10", description: "Delivery date" })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: "14:30", description: "Delivery time" })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    example: 123,
    description: "ID of the user placing the order",
  })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ example: "Furniture", description: "Name of the load" })
  @IsString()
  @IsNotEmpty()
  load_name: string;

  @ApiProperty({ example: 500, description: "Weight of the load in kg" })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: 20, description: "Capacity required for the load" })
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({
    example: "Handle with care",
    description: "Description of the load",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "John Doe", description: "Name of the recipient" })
  @IsString()
  @IsNotEmpty()
  recipient_name: string;

  @ApiProperty({
    example: "+1234567890",
    description: "Phone number of the recipient",
  })
  @IsPhoneNumber(null)
  @IsNotEmpty()
  recipient_phone: string;

  @ApiProperty({
    example: "123 Main St",
    description: "Starting location of the delivery",
  })
  @IsString()
  @IsNotEmpty()
  location_start: string;

  @ApiProperty({ example: "Express", description: "Type of delivery" })
  @IsString()
  @IsNotEmpty()
  type: string;
}
