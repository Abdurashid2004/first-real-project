import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyOtpDto {
  @ApiProperty({
    description: "Foydalanuvchi kiritgan OTP kodi, aniq 6 ta belgidan iborat",
    example: "1234",
  })
  @IsNumber()
  @IsNotEmpty()
  otp: number;

  @ApiProperty({
    description: "Tekshirish uchun ma'lumot",
    example: "someCheckValue",
  })
  @IsString()
  @IsPhoneNumber("UZ")
  @IsNotEmpty()
  check: string;
}
