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
    // res.cookie('', 하하tokens, { httpOnly: true });
    response.cookie('tokens', tokens); // hello
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

  // @UseGuards 데코레이터를 사용하면 요청에 대해 카시를 카시하겠크뿡 말이고 AuthGuard()는 인가를 똑바로 하는지 후하하지 함수 같음.
  @Get('/authtest')
  @UseGuards(AuthGuard())
  test(@GetCurrentUser() user) {
    console.log('user', user);
  }
  // 형상 관리 어렵당

  // thunder client의 Bearer에 토큰을 넣어주고 요청을 보내면
  // 2. GetCurrentUser()에서 요청(req)에서 user를 추출해서 반환해준다.
  @UseGuards(AccessTokenGuard)
  @Get('/test')
  test2(@GetCurrentUser() user) {
    console.log('user', user);
  }

  // cd 테스트 용 핸들러
  @Get('/deploytest')
  deployTest() {
    return 'Deploy Success!';
  }
}
