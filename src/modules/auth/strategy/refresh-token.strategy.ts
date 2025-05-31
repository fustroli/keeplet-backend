import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { ICurrentUser } from 'src/modules/auth/interfaces';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: config.getOrThrow('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(req: Request, payload: ICurrentUser) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
