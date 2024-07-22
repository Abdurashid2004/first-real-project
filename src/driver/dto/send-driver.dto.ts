import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsPhoneNumber,
} from "class-validator";

export class SendDriverDto {
  @ApiProperty({
    example: "+998912345678",
    description: "The phone number of the driver",
  })
  @IsNotEmpty()
  @IsPhoneNumber("UZ")
  phone: string;
}
