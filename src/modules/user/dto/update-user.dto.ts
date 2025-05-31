import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { CreateUserDto } from 'src/modules/auth/dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  readonly refreshToken?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Google ID of the user' })
  readonly googleId?: string;

  @IsString()
  @IsOptional()
  hash?: string;
}
