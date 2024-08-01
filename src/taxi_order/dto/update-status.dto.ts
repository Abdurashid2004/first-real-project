import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateStatusDto {
  @ApiProperty({
    description: "Taksi buyurtmasining hozirgi holati",
    example: "In Progress",
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}
