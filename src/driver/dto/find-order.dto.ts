import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";

export class FindOrderDto {
  @ApiProperty({
    example: 4,
    description: "The city where the driver is from",
  })
  @IsNotEmpty()
  @IsNumber()
  from: number;

  @ApiProperty({
    example: 3,
    description: "The city where the driver is going to",
  })
  @IsNotEmpty()
  @IsNumber()
  to: number;
}
