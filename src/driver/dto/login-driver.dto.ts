import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class LoginDriverDto {
  @ApiProperty({
    example: "+998912345678",
    description: "The phone number of the driver",
  })
  @IsNotEmpty()
  @IsPhoneNumber("UZ")
  phone: string;

  @ApiProperty({
    example: "9034gqngr",
    description: "The password of the driver",
  })
  @IsNotEmpty()
  password: string;
}
