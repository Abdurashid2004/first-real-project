import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
} from "class-validator";

export class CreateClientDto {
  @ApiProperty({
    description: "Phone number of the client",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber("UZ") //+998901234567
  phone: string;
}
