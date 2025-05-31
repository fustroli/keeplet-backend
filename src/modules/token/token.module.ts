import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/modules/auth/strategy';
import { Module } from '@nestjs/common';
import { TokenService } from 'src/modules/token/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/service';

@Module({
  imports: [TypeOrmModule.forFeature([]), JwtModule.register({})],
  controllers: [],
  providers: [TokenService, JwtStrategy, UserService],
  exports: [TokenService],
})
export class TokenModule {}
