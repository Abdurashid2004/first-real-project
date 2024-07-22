import { ApiProperty } from "@nestjs/swagger";

export class CreateBalanceDto {
  @ApiProperty({ example: 1000, description: "The amount of the balance" })
  amount: number;

  @ApiProperty({
    example: "12345",
    description: "The ID of the driver associated with the balance",
  })
  driver_id: number;
}
