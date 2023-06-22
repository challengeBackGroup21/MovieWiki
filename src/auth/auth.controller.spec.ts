import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth-credential.dto';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
import { UserRepository } from './user.repository';

class MockUsersRepository {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUser = jest.fn().mockImplementation((signUpDto, hashedPassword) => {
    if (signUpDto.nickname === 'existingNickname') {
      throw new ConflictException('중복된 닉네임입니다.');
    }

    if (signUpDto.email === 'existingEmail@example.com') {
      throw new ConflictException('중복된 이메일입니다.');
    }

    return Promise.resolve();
  });
}

class MockAuthService {
  userRepository: MockUsersRepository;
  constructor(userRepository: MockUsersRepository) {
    this.userRepository = userRepository;
  }
  signUp = jest.fn().mockImplementation((signupDto) => {
    const hashedPassword = '';
    return this.userRepository.createUser(signupDto, hashedPassword);
  });
  login = jest
    .fn()
    .mockImplementation(() =>
      Promise.resolve({ accessToken: '', refreshToken: '' }),
    );
}

/*
  signUp과 login 핸들러 테스트
  1. signUp 함수. signUpDto 객체를 요청에서 받아드리는 구만.
  return 값은 딱히 없는 듯하다. repository의 함수에서 아무것도 return 해주지 않는다.

  2. login 함수. loginDto 객체를 요청에서 받아드린다.
  return 값은 Promise<Tokens>. Tokens 객체 안에는 accessToken, refreshToken 프로퍼티들이 있다.
  */
describe('AuthController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authController: AuthController;
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersRepository: UserRepository;
  let app: INestApplication;

  // 매 테스트 전에 모듈을 만들어주기
  // 이 코드는 그냥 진짜 app에다가 http request 넣어주는 e2e 테스트 용으로 testingModule을 만드는 것 같은데?
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => new MockAuthService(new MockUsersRepository()),
        },
        {
          provide: UserRepository,
          useClass: MockUsersRepository,
        },
      ],
    }).compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UserRepository>(UserRepository);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // await app.close();
  });

  /**
   로그인 테스트
   */
  describe('login', () => {
    it('login success', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const tokens = { accessToken: '', refreshToken: '' };

      jest.spyOn(authService, 'login').mockImplementation(async () => {
        return tokens;
      });

      const loginResult = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(loginResult).toEqual(tokens);
    });
  });

  // 회원가입 테스트
  describe('signup', () => {
    it('signUp success', async () => {
      const signupDto: SignUpDto = {
        email: 'test@example.com',
        nickname: 'test',
        password: 'password',
      };

      // spyOn은 객체의 메소드를 감시한다. 아래 코드는 authService의 signUp 메소드를 감시하는 상황이다.
      // 그런데 여기에서 감시를 한다고 하면 뭐 어쩌라는 것인지 잘 모르겠다.
      // mocking 함수를 만들어서 이 테스트에서는 signUp 메소드가 아래와 같은 동작을 하게 변경된다.
      jest.spyOn(authService, 'signUp').mockImplementation(async () => {
        await usersRepository.createUser(signupDto, 'hashedPassword');
      });

      authController.signUp(signupDto);

      expect(authService.signUp).toHaveBeenCalledTimes(1);
      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
    });
  });
});
