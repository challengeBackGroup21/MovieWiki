import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { jwtConstants } from './constans';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  /**
   로그인 메소드
   일단 지금 해야 할 일이 무엇인지 생각해보자.
   */
  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    // email로 찾아옴. 그래서 뭐 어쩌게
    const user = await this.userRepository.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { userId: user.userId, email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async logout(user: User): Promise<void> {
    // 로그아웃 로직
    // accessToken과 refreshToken을 제거해야 할 것 같다. 그리고 서버에 있는 refreshToken도 제거해줘야 할 것 같다.
    // refreshToken을 제거하는 로직임.
    await this.userRepository.updateRefreshToken(user.userId, null);
  }

  async refreshAccessToken(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with id "${userId}" does not exist`);
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(`Refresh token does not match`);
    }

    const accessToken = await this.getAccessToken(user.userId, user.email);

    return { accessToken };
  }

  // target 문자열을 해시해서 반환하는 메소드
  // - password와 refreshToken을 db에 저장 전 해싱 하기 위해
  async hash(target: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(target, salt);
  }

  async getAccessToken(userId: number, email: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: jwtConstants.atSecret,
        expiresIn: jwtConstants.atExpiresIn,
      },
    );
  }

  async getRefreshToken(userId: number, email: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: jwtConstants.rtSecret,
        expiresIn: jwtConstants.rtExpiresIn,
      },
    );
  }

  // 액세스 토큰과 리프레시 토큰을 발급받아 반환하는 메소드
  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = [
      await this.getAccessToken(userId, email),
      await this.getRefreshToken(userId, email),
    ];

    return {
      accessToken,
      refreshToken,
    };
  }
}
