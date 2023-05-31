import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { LoginDto, SignUpDto } from './dto/auth-credential.dto';
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

  async signUp(signUpDto: SignUpDto): Promise<void> {
    return this.userRepository.createUser(signUpDto);
  }

  /**
   로그인 메소드
   1. 해당 유저인지 확인
   2. token 생성
   3. userTable에 refreshToken 넣어주기
   */
  async login(loginDto: LoginDto): Promise<Tokens> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = await this.getTokens(user);
      const hashedRefreshToken = await this.hash(tokens.refreshToken);
      await this.userRepository.updateRefreshToken(
        user.userId,
        hashedRefreshToken,
      );
      return tokens;
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

    const accessToken = await this.getAccessToken(user);

    return { accessToken };
  }

  // target 문자열을 해시해서 반환하는 메소드
  // - password와 refreshToken을 db에 저장 전 해싱 하기 위해
  async hash(target: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(target, salt);
  }

  async getAccessToken(user: User): Promise<string> {
    const { userId, email, nickname } = user;
    return await this.jwtService.signAsync(
      {
        userId,
        email,
        nickname,
      },
      {
        secret: jwtConstants.atSecret,
        expiresIn: jwtConstants.atExpiresIn,
      },
    );
  }

  async getRefreshToken(user: User): Promise<string> {
    const { userId, email, nickname } = user;
    return await this.jwtService.signAsync(
      {
        userId,
        email,
        nickname,
      },
      {
        secret: jwtConstants.rtSecret,
        expiresIn: jwtConstants.rtExpiresIn,
      },
    );
  }

  // 액세스 토큰과 리프레시 토큰을 발급받아 반환하는 메소드
  async getTokens(user: User): Promise<Tokens> {
    const [accessToken, refreshToken] = [
      await this.getAccessToken(user),
      await this.getRefreshToken(user),
    ];

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUsers() {
    return await this.userRepository.find();
  }
}
