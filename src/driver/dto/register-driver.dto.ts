import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { IsUzbekPassportNumber } from "../../decorators/validator/IsUzbekPassportNumber";

export class RegisterDriverDto {
  @ApiProperty({ example: "John", description: "The first name of the driver" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: "Doe", description: "The last name of the driver" })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({ example: 30, description: "The age of the driver" })
  @IsNotEmpty()
  @IsNumberString()
  age: number;

  @ApiProperty({
    example: "AS1234567",
    description: "The passport number of the driver",
  })
  @IsNotEmpty()
  @IsUzbekPassportNumber()
  passport: string;

  @ApiProperty({
    example: "9034gqngr",
    description: "The password of the driver",
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: "string", format: "binary" })
  photo: any;

  @ApiProperty({ type: "string", format: "binary" })
  prava: any;

  @ApiProperty({
    description: "Name of the client",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
