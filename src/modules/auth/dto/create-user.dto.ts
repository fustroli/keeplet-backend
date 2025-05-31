import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/modules/auth/decorators';
import { PASSWORD_MIN_LENGTH } from 'src/modules/auth/constants';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'email@keeplet.com', required: true })
  @Transform(({ value }) => value.trim())
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: PASSWORD_MIN_LENGTH,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({ example: 'StrongPassword1', required: true })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Match<CreateUserDto>('password', {
    message: 'Passwords do not match',
  })
  @ApiProperty({ example: 'StrongPassword1', required: true })
  readonly confirmPassword: string;
}
