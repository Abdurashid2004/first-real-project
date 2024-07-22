import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCarDto {
  @ApiProperty({
    type: String,
    format: "binary",
  })
  photo: any;

  @ApiProperty({ example: "ABC123", description: "The car number" })
  @IsString()
  car_number: string;

  @ApiProperty({
    example: "Toyota Corolla",
    description: "The model of the car",
  })
  @IsString()
  model: string;

  @ApiProperty({ example: "Red", description: "The color of the car" })
  @IsString()
  color: string;

  @ApiProperty({ example: "SUV", description: "The type of the car" })
  @IsString()
  car_type: string;

  @ApiProperty({
    example: "TX123456",
    description: "The technical passport of the car",
  })
  @IsString()
  tex_passport: string;
}
