import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class RegisterClientDto {
  @ApiProperty({
    description: "Name of the client",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Phone number of the client",
    example: "password",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "Phone number of the client",
    example: "password",
  })
  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  @ApiProperty({
    description: "Name of the client",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Name of the client",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  gender: string;
}
