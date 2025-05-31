import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'email@keeplet.com', required: true })
  @Transform(({ value }) => value.trim())
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'StrongPassword1', required: true })
  readonly password: string;
}
