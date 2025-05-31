import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSocialUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'email@keeplet.com', required: true })
  @Transform(({ value }) => value.trim())
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly googleId: string;
}
