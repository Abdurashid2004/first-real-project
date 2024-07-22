import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordAdminDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
