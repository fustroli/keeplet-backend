import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ICurrentUser } from 'src/modules/auth/interfaces';
import { User } from 'src/modules/user/entities';

import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: ICurrentUser) {
    const id = payload.sub;

    const user = await this.repository.findOne({
      where: { id },
    });

    //TODO: delete user.hash;
    return user;
  }
}
