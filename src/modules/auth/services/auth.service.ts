import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/service';
import { TokenService } from 'src/modules/token/services';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
} from 'src/modules/auth/dto';
import { EExpirationStrategy } from 'src/modules/token/enum';
import { CreateSocialUserDto } from 'src/modules/user/dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(dto: CreateUserDto, res: Response) {
    const existingUser = await this.repository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) throw new ForbiddenException('Credentials taken');

    const hash = await this.tokenService.hashString(dto.password);

    const user = this.repository.create({
      email: dto.email,
      hash,
    });

    try {
      const savedUser = await this.repository.save(user);

      const { accessToken, refreshToken } = await this.tokenService.getTokens(
        savedUser.id,
        savedUser.email,
      );

      await this.tokenService.updateRefreshTokenHash(
        savedUser.id,
        refreshToken,
      );

      return this.tokenService.returnTokensAsCookies(
        accessToken,
        refreshToken,
        res,
        savedUser,
      );
    } catch {
      throw new InternalServerErrorException(
        'User creation failed due to a server error',
      );
    }
  }

  async signIn(dto: LoginUserDto, res: Response) {
    const { email } = dto;
    const user = await this.repository.findOne({
      where: { email: email },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await bcrypt.compare(dto.password, user.hash);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    const { accessToken, refreshToken } = await this.tokenService.getTokens(
      user.id,
      email,
    );

    await this.tokenService.updateRefreshTokenHash(user.id, refreshToken);

    return this.tokenService.returnTokensAsCookies(
      accessToken,
      refreshToken,
      res,
      user,
    );
  }

  public async signOut(id: number, res: Response): Promise<Response> {
    await this.userService.update(id, { refreshToken: undefined });

    return this.tokenService.returnTokensAsCookies(
      '',
      '',
      res,
      null,
      EExpirationStrategy.IMMEDIATE,
    );
  }

  public async refresh(req, res: Response) {
    const user = req.user;

    const { accessToken, refreshToken } = await this.tokenService.getTokens(
      user.id,
      user.email,
    );

    await this.tokenService.updateRefreshTokenHash(user.id, refreshToken);

    return this.tokenService.returnTokensAsCookies(
      accessToken,
      refreshToken,
      res,
      user,
    );
  }

  public async validateSocialUser(socialUser: CreateSocialUserDto) {
    const user = await this.userService.findByEmail(socialUser.email);

    const userData = {
      email: socialUser.email,
      googleId: socialUser.googleId,
    };

    if (user) {
      const updatedUser = await this.userService.update(user.id, userData);
      return updatedUser;
    }

    const newUser = await this.userService.createUser(userData);
    return newUser;
  }

  async googleSignIn(socialUser: CreateSocialUserDto, res: Response) {
    const user = await this.validateSocialUser(socialUser);

    const { accessToken, refreshToken } = await this.tokenService.getTokens(
      user.id,
      user.email,
    );

    await this.tokenService.updateRefreshTokenHash(user.id, refreshToken);

    return this.tokenService.setTokensAsCookies(accessToken, refreshToken, res);
  }

  async changePassword(dto: ChangePasswordDto, id: number) {
    const user = await this.userService.findById(id);

    if (!user) throw new ForbiddenException('User not found');

    const pwMatches = await bcrypt.compare(dto.oldPassword, user.hash);
    if (!pwMatches) throw new ForbiddenException('Old password is incorrect');

    const hash = await this.tokenService.hashString(dto.password);

    await this.userService.update(user.id, { hash });

    return { message: 'Password updated successfully' };
  }
}
