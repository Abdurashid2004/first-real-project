import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRegionDto {
  @ApiProperty({ example: "Toshkent", description: "The name of the region" })
  @IsString()
  @IsNotEmpty()
  name: string;

}
