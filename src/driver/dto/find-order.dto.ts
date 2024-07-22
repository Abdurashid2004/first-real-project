import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class FindOrderDto {
  @ApiProperty({
    example: "Tashkent",
    description: "The city where the driver is from",
  })
  @IsNotEmpty()
  from: number;

  @ApiProperty({
    example: "Samarkand",
    description: "The city where the driver is going to",
  })
  @IsNotEmpty()
  to: number;
}
