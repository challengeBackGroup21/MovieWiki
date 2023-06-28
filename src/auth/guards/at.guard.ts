import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

// AuthGuard 클래스를 상속받는 클래스

// - jwt: strategies/at.strategy에서 설정한 전략 이름
// - reflector: 컨트롤러나 핸들러의 메타데이터를 읽거나 설정해준다.
// 컨트롤러: 요청을 처리하고 응답을 반환하는 주체. @Controller 데코레이터를 통해 지정된다.
// 컨트롤러는 메소드(핸들러)들을 가지고 있으며 메소드들은 실제로 요청을 처리하고 응답을 반환한다.

// 핸들러: 컨트롤러 내에서 실제로 응답을 처리하는 메소드 @Get, @Post, @Put 등의 데코레이터를 통해 지정된다.

// @Injectable() 데코레이터를 적용한 클래스는 다른 클래스에서 의존성으로 추가할 수 있다.
// AuthGuard('jwt')는 주어진 전략에 따라 인증을 수행하는 클래스. 현재 전략은 jwt임.
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // AuthGuard에 있는 메소드를 재정의 한 것. 특정 조건에 따라 인증을 수락할 수도, 인증을 거부할 수도 있음.
  canActivate(context: ExecutionContext) {
    // ExecutionContext는 Nest.js에서 사용되는 실행 컨텍스트. 요청이 처리되는 동안 컨트롤러와 인터셉터, 가드 등의 각종 핸들러 정보를 전달하고 상호작용하게 함.
    // 요청이 들어왔을 때 컨트롤러나 핸들러의 isPublic 메타데이터가 true인 경우
    // 인증 과정을 거치지 않고 요청을 허용함
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(), // 현재 실행 중인 핸들러를 가져온다. (Guard를 가져오려나?)
      context.getClass(), // 현재 실행 중인 클래스(컨트롤러)를 가져온다.
    ]);

    if (isPublic) {
      return true;
    }

    // 그렇지 않은 경우 부모 클래스의 인증 과정을 수행함
    // 여기에서 strategy가 사용되는 것 같다.
    return super.canActivate(context);
  }
}
