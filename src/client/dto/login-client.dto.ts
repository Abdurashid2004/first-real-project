import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginClientDto {
  @ApiProperty({
    description: "Foydalanuvchi paroli",
    example: "StrongPassword123!",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "Foydalanuvchi telefon raqami",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber("UZ")
  phone: string;
}
