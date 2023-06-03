import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GetCurrentUser, GetCurrentUserId } from './common/decorators';
import { LoginDto, SignUpDto } from './dto/auth-credential.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Tokens> {
    const tokens = this.authService.login(loginDto);
    // res.cookie('tokens', tokens, { httpOnly: true });
    response.cookie('tokens', tokens);
    return tokens;
  }

  @Put('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser() user) {
    this.authService.logout(user);
    return 'logout';
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshAccessToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(userId, refreshToken);
  }

  // @UseGuards 데코레이터를 사용하면 요청에 대해 가드를 적용하겠다는 말이고, AuthGuard()는 인가를 똑바로 하는지 판단하는 함수 같음.
  // @Controller 위에 @UseGuards를 적용하면 해당 컨트롤러의 모든 요청에 가드를 적용하게 됨.
  @Get('/authtest')
  @UseGuards(AuthGuard())
  test(@GetCurrentUser() user) {
    console.log('user', user);
  }

  // thunder client의 Bearer에 토큰을 넣어주고 요청을 보내면
  // 1. UseGuards에서 토큰을 파싱해서 요청(req)에 user 객체를 넣어준다.(userId, email, nickname)
  // 2. GetCurrentUser()에서 요청(req)에서 user를 추출해서 반환해준다.
  @UseGuards(AccessTokenGuard)
  @Get('/test')
  test2(@GetCurrentUser() user) {
    console.log('user', user);
  }

  @Get('/deploytest')
  deployTest() {
    return 'Deploy Success!';
  }
}
