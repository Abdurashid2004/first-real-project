import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsOptional,
} from "class-validator";

export class FindUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPhoneNumber("UZ") //+998901234567
  phone: string;
}
