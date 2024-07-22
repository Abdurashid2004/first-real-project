import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { IsUzbekPassportNumber } from "../../decorators/validator/IsUzbekPassportNumber";

export class UpdateDriverDto {
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the driver",
  })
  @ApiProperty({ example: "John", description: "The first name of the driver" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: "Doe", description: "The last name of the driver" })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty({ example: 30, description: "The age of the driver" })
  @IsOptional()
  @IsNumberString()
  age?: number;

  @ApiProperty({
    example: "+998912345678",
    description: "The phone number of the driver",
  })
  @IsOptional()
  @IsPhoneNumber("UZ")
  phone?: string;

  @ApiProperty({
    example: "Tashent",
    description: "where from",
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty({
    example: "Samarkand",
    description: "where to",
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiProperty({
    example: "9034gqngr",
    description: "The password of the driver",
  })
  @IsOptional()
  @IsString()
  password?: string;
}
