import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class SummaDto {
  @ApiProperty({ example: 4000, description: "driver total balance add summa" })
  @IsNotEmpty()
  @IsNumber()
  sum: number;
}
