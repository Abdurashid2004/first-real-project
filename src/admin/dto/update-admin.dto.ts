import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({
    example: 'login',
    required: true,
  })
  @IsString()
  login?: string;

  @ApiProperty({
    example: 'login',
    required: true,
  })
  @IsString()
  password?: string;

  @ApiProperty({
    example: 'login@link',
    required: true,
  })
  @IsString()
  tg_link?: string;

  @ApiProperty({
    example: 'login/image',
    required: true,
  })
  @IsString()
  photo?: string;
}
