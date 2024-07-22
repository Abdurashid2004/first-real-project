import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'login',
    required: true,
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'login@gmail.com',
    required: true,
  })
  @IsString()
  tg_link: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsString()
  confirm_password: string;


}
