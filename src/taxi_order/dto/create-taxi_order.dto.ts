import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaxiOrderDto {
  @ApiProperty({
    description: "Taksi buyurtmasining sanasi",
    example: "2024-07-25",
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: "Taksi buyurtmasining tavsifi",
    example: "Airport pickup",
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "Taksi buyurtmasining boshlanish joyi",
    example: "Tashkent International Airport",
  })
  @IsString()
  @IsNotEmpty()
  location_start: string;

  @ApiProperty({
    description: "Taksi buyurtmasining boshlanish manzili ID",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  from_distinct_id: number;

  @ApiProperty({
    description: "Taksi buyurtmasining tugash manzili ID",
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  to_distinct_id: number;

  @ApiProperty({
    description: "Taksi buyurtmasining mijoz ID",
    example: 101,
  })
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({
    description: "Taksi buyurtmasining haydovchi ID",
    example: 20,
  })
  @IsNumber()
  driverId?: number;

  @ApiProperty({
    description: "Taksi buyurtmasining soni",
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty({
    description: "Taksi buyurtmasining narxi",
    example: 50000,
  })
  price: string;

  @ApiProperty({
    description: "Taksi buyurtmasining hozirgi holati",
    example: "In Progress",
  })
  @IsString()
  status?: string;
}
