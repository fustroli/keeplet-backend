import { GoogleStrategy, JwtStrategy } from 'src/modules/auth/strategy';

import { AuthController } from 'src/modules/auth/controller';
import { AuthService } from 'src/modules/auth/services';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TokenService } from 'src/modules/token/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities';
import { UserModule } from 'src/modules/user/user.module';
import googleOauthConfig from 'src/modules/auth/config/google-oauth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    ConfigModule.forFeature(googleOauthConfig),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
