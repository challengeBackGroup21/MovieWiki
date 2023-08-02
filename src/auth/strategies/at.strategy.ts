import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import config from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../user.repository';

//  PassportStrategy 클래스를 상속받는 클래스

//  - PassportStrategy: Passport에서 제공하는 기본 전략들의 기반 클래스
//  - Strategy: Passport에서 실제로 사용할 전략
//  - jwt: 전략의 이름

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    const jwtConfig = config.get('jwt');
    super({
      // 헤더에서 Bearer 스킴을 사용하여 jwt 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwt의 시크릿 키 검증
      secretOrKey: jwtConfig.atSecret,
    });
  }

  // guard에서 입력받은 jwt를 파싱하고 나서 payload를 수정할 수 있음.
  async validate(payload: any) {
    // userRepository에 접근 한 후 payload에 넣어준다.
    const userId = payload.userId; // payload에서 사용자 ID 추출 (예시)
    // 근대 이렇게 하면 문제가 accessToken을 사용하는 이유가 없을 수도 있다는 점. 매 번 이런 식으로 하면 그냥 refreshToken이 없어도 되는 것 아닌가?
    const user = await this.userRepository.findUserById(userId); // 데이터베이스에서 사용자 조회 (예시)

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('정지된 계정입니다.');
    }

    if (user.limitedAt && user.limitedAt > new Date()) {
      throw new UnauthorizedException('정지된 계정입니다.');
    }

    console.log('userData', user);

    // 유효한 사용자인지 여부에 따라 반환값을 수정할 수 있음
    return user;
  }
}
