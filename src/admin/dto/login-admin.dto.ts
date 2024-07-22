import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    example: 'login',
    required: true,
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
