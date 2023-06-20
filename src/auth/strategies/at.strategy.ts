import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import config from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';

//  PassportStrategy 클래스를 상속받는 클래스

//  - PassportStrategy: Passport에서 제공하는 기본 전략들의 기반 클래스
//  - Strategy: Passport에서 실제로 사용할 전략
//  - jwt: 전략의 이름

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const jwtConfig = config.get('jwt');
    super({
      // 헤더에서 Bearer 스킴을 사용하여 jwt 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwt의 시크릿 키 검증
      secretOrKey: jwtConfig.atSecret,
    });
  }

  // guard에서 입력받은 jwt를 파싱하고 나서 payload를 수정할 수 있음.
  validate(payload: any) {
    // userRepository에 접근 한 후 payload에 넣어준다.
    return payload;
  }
}
