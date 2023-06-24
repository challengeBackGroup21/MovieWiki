import { Module } from '@nestjs/common';
import { User } from './user.entity';
// JWT 토큰을 생성할 수 있다.
import { JwtModule } from '@nestjs/jwt';
// Nest에서 인증을 처리하기 위한 모듈
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// JWT 토큰의 유효성을 검사할 수 있는 모듈
import { UserRepository } from './user.repository';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // auth-module에 jwt-Passport를 적용한다.
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]), // forFeature는 현재 module에 특정 Entity를 등록하는 데 사용한다. 이 경우 User Entity를 auth-module에서 사용할 수 있다.
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
