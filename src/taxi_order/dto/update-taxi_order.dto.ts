import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTaxiOrderDto {
  @ApiProperty({
    description: "Taksi buyurtmasining hozirgi holati",
    example: "In Progress",
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: "Taksi buyurtmasining haydovchi ID",
    example: 20,
    required: false,
  })
  driverId?: number;
}
