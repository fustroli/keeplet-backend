import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { appConfig } from 'src/config';
import { CurrentUser } from 'src/modules/auth/decorators';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
} from 'src/modules/auth/dto';
import { GoogleAuthGuard, RefreshJwtGuard } from 'src/modules/auth/guard';
import { AuthService } from 'src/modules/auth/services';

@UseGuards(ThrottlerGuard)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: CreateUserDto, @Res() res: Response) {
    return this.authService.signUp(dto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: LoginUserDto, @Res() res: Response) {
    return this.authService.signIn(dto, res);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  refresh(@Req() req, @Res() res: Response) {
    return this.authService.refresh(req, res);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Initiates Google OAuth2 login
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    await this.authService.googleSignIn(user, res);
    res.redirect(`${appConfig.FRONTEND_URL}/dashboard`);
  }

  @Post('change-password')
  changePassword(
    @CurrentUser('sub') id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(dto, id);
  }
}
