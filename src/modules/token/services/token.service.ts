import * as bcrypt from 'bcrypt';

import { CookieOptions, Response } from 'express';
import { HttpStatus, Injectable } from '@nestjs/common';
import { appConfig, tokenConfig } from 'src/config';

import { ConfigService } from '@nestjs/config';
import { EExpirationStrategy } from 'src/modules/token/enum';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/service';
import parse from 'parse-duration';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TokenService {
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    this.accessTokenExpiration = this.config.get(
      'ACCESS_TOKEN_EXPIRATION',
    ) as string;
    this.refreshTokenExpiration = this.config.get(
      'REFRESH_TOKEN_EXPIRATION',
    ) as string;
  }

  async getTokens(
    id: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { email, sub: id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.accessTokenExpiration,
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.refreshTokenExpiration,
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async hashString(password: string): Promise<string> {
    return await bcrypt.hash(password, tokenConfig.SALT_WORK_FACTOR);
  }

  returnTokensAsCookies(
    accessToken: string,
    refreshToken: string,
    res: Response,
    user: User | null,
    expirationStrategy: EExpirationStrategy = EExpirationStrategy.DEFAULT,
  ) {
    this.setTokensAsCookies(accessToken, refreshToken, res, expirationStrategy);

    return this.sendResponse(res, user);
  }

  public setTokensAsCookies(
    accessToken: string,
    refreshToken: string,
    res: Response,
    expirationStrategy: EExpirationStrategy = EExpirationStrategy.DEFAULT,
  ) {
    const cookieOptions = this.getDefaultCookieOptions();
    const { accessExpiration, refreshExpiration } =
      this.calculateExpirationTimes(expirationStrategy);

    this.setCookie(res, 'accessToken', accessToken, {
      ...cookieOptions,
      expires: new Date(accessExpiration),
    });

    this.setCookie(res, 'refreshToken', refreshToken, {
      ...cookieOptions,
      expires: new Date(refreshExpiration),
    });
  }

  private getDefaultCookieOptions(): CookieOptions {
    return {
      secure: appConfig.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
    };
  }

  private calculateExpirationTimes(expirationStrategy: EExpirationStrategy): {
    accessExpiration: number;
    refreshExpiration: number;
  } {
    const now = Date.now();

    const accessDuration = parse(this.accessTokenExpiration) ?? 0;
    const refreshDuration = parse(this.refreshTokenExpiration) ?? 0;

    let accessExpiration = now + accessDuration;
    let refreshExpiration = now + refreshDuration;

    if (expirationStrategy === EExpirationStrategy.IMMEDIATE) {
      accessExpiration = refreshExpiration = now;
    }

    return { accessExpiration, refreshExpiration };
  }

  private setCookie(
    res: Response,
    name: string,
    value: string,
    options: CookieOptions,
  ) {
    res.cookie(name, value, options);
  }

  private sendResponse(res: Response, user: User | null): Response {
    const result = plainToInstance(User, user);
    return res.status(HttpStatus.OK).json(result);
  }

  async updateRefreshTokenHash(
    id: number,
    refreshToken: string,
  ): Promise<void> {
    const hash = await this.hashString(refreshToken);

    await this.userService.update(id, { refreshToken: hash });
  }
}
