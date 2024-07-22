import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateDistrictDto {
  @ApiProperty({
    example: "Bekobod",
    description: "The name of the district",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: "The ID of the region associated with the district",
  })
  @IsNumber()
  @IsNotEmpty()
  region_id: number;
}
