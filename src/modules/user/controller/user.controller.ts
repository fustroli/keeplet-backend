import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ThrottlerGuard } from '@nestjs/throttler';
import { CurrentUser } from 'src/modules/auth/decorators';
import { JwtGuard } from 'src/modules/auth/guard';
import { UpdateUserDto, UserResponseDto } from 'src/modules/user/dto';
import { User } from 'src/modules/user/entities';
import { UserInterceptor } from 'src/modules/user/interceptors';
import { UserService } from 'src/modules/user/service';

@ApiTags('users')
@UseGuards(JwtGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  @UseInterceptors(UserInterceptor)
  @ApiOkResponse({ type: UserResponseDto })
  async getMe(@CurrentUser() currentUser: User): Promise<UserResponseDto> {
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    return currentUser;
  }

  @Patch('me')
  @UseInterceptors(UserInterceptor)
  @ApiOkResponse({ type: UserResponseDto })
  async updateMe(
    @CurrentUser() currentUser: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(currentUser.id, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMe(@CurrentUser() user: User) {
    return this.userService.deleteOne(user.id);
  }
}
