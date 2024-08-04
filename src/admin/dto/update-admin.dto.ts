import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateAdminDto {
  @ApiProperty({
    example: "login",
    
  })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiProperty({
    example: "login",
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: "login@link",
  })
  @IsOptional()
  @IsString()
  tg_link?: string;
  @ApiProperty({
    example: true,
  })
  @IsOptional()
  is_active?: boolean;
}
