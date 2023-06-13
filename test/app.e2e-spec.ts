import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { LoginDto } from 'src/auth/dto/auth-credential.dto';

/*
 어떤 테스트가 진행되야 할까?
 */
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // 우선 회원가입, 로그인이 잘 되는지 확인해야 할 것 같다.

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('login', () => {
    // e2e 테스트 용 코드
    it('login success', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);
      expect(response.status).toEqual(HttpStatus.OK);
      // expect(authService.login).toHaveBeenCalledTimes(1);
      // expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
