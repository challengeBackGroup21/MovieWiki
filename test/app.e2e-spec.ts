import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginDto, SignUpDto } from '../src/auth/dto/auth-credential.dto';
import * as config from 'config';
import { typeORMConfig } from '../src/configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../src/common/exceptions/http-exception-filter';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { CreatePostRecordDto } from 'src/posts/dto/create-post-record.dto';
import { PostService } from 'src/posts/posts.service';
import { PostController } from 'src/posts/posts.controller';
import { MovieRepository } from 'src/movies/movie.repository';
import { Movie } from 'src/movies/movie.entity';
/**
 1. 회원가입, 로그인
 2. 영화 상세 기록 생성 및 수정
 3. 특정 영화 post 버전 전체 조회
 */
describe('AppController (e2e)', () => {
  // app 인스턴스를 만들기 전에 main.ts에서 주입해줬던 것과 동일하게 해줘야 한다.
  let app: INestApplication;
  let dataSource: DataSource;
  let postController: PostController;
  let postService: PostService;
  let movieRepository: Repository<Movie>;

  let accessToken: string;

  beforeAll(async () => {
    // testingModule을 하나 생성한다. 이 모듈을 통해 app 인스턴스를 생성한다.
    const dbConfig = config.get('db');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRootAsync(typeORMConfig),
        // TypeOrmModule.forRoot({
        //   type: 'postgres',
        //   host: 'localhost',
        //   port: 5432,
        //   username: 'postgres',
        //   password: 'marx1818ch!',
        //   database: 'MovieWikiTest',
        //   entities: [__dirname + '/../**/*.entity.{js,ts}'],
        //   synchronize: true,
        //   ssl: {
        //     rejectUnauthorized: false,
        //   }, // SSL 옵션을 비활성화
        //   logging: true,
        // }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    postController = moduleFixture.get<PostController>(PostController);
    postService = moduleFixture.get<PostService>(PostService);
    movieRepository = moduleFixture.get('MovieRepository');
    // await movieRepository.query(`
    //   CREATE SPATIAL INDEX spatial_index ON hospitals(point);
    // `); // point column에 nullable = false로 설정해주어야함
    // await movieRepository.query(
    //   `SELECT setval('table_id_seq', (SELECT MAX(movieId) FROM movie))`,
    // );

    const movies = await movieRepository.query(`
      SELECT * FROM movie limit 10
    `);
    console.log('movies', movies);

    await movieRepository.query(`
      INSERT INTO movie ("movieCd", "movieNm", "showTm", "openDt", "typeNm", "nationAlt", "genreAlt", "directors", "actors", "watchGradeNm")
      VALUES ('20070061', '트랜스포머', '143', '20070628', '장편', '미국', 'SF,액션,어드벤처', '[{"peopleNm":"마이클 베이"}]', '[{"cast":"샘 윗윅키","castEn":"","peopleNm":"샤이아 라보프","peopleNmEn":"Shia LaBeouf"},{"cast":"","castEn":"","peopleNm":"메간 폭스","peopleNmEn":"Megan Fox"}]', '12세이상관람가');
    `);

    // 여기에서 signUp 한 번 하고 그 데이터를 이용할 수 있지 않을까?
    const signUpDto: SignUpDto = {
      email: 'meadd231@gmail.com',
      nickname: 'meadd231',
      password: 'qwer1234',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signUpDto);
  });

  beforeEach(async () => {
    // 여기에서 로그인을 계속 해줘야 할까? 그런데 그것을 어떻게 전달하지?
  });

  afterAll((done) => {
    console.log('dataSource.destroy');
    app.close();
    done();
  });

  it('login success', async () => {
    const loginDto: LoginDto = {
      email: 'meadd231@gmail.com',
      password: 'qwer1234',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    console.log('response.body', response.body);
    expect(response.status).toEqual(HttpStatus.OK);
  });

  it('signUp success', async () => {
    // 회원가입 성공
  });

  it('영화 상세 정보 생성 및 수정', async () => {
    const createPostRecordDto: CreatePostRecordDto = {
      content: '너무 재미있어요.',
      comment: 'ㅇㅇ',
      version: 1,
    };

    const mockUser: any = {
      userId: 1,
      email: '',
      nickname: 'Test User',
      auth: 'admin',
      // 필요한 사용자 정보 추가
    };
    const accessToken = '';

    jest.spyOn(postService, 'createPostRecord');

    const response = await request(app.getHttpServer())
      .post('/1/record')
      .send(createPostRecordDto)
      .set('Authorization', `Bearer ${accessToken}`);

    // 응답 검증
    expect(response.status).toBe(HttpStatus.CREATED); // 201 Created 상태코드를 기대
    expect(response.body).toEqual('');

    // createPostRecord() 메서드 호출 및 결과 검증
    const createdRecord = await postController.createPostRecord(
      createPostRecordDto,
      1,
      mockUser,
    );
    expect(createdRecord).toEqual({
      message: '영화 기록 생성에 성공했습니다.',
    }); // createPostRecord()에 전달된 인자를 검증

    const movieId = 1;
    const user = '';
    expect(postService.createPostRecord).toHaveBeenCalledWith(
      createPostRecordDto,
      movieId,
      user,
    ); // createPostRecord()가 올바르게 호출되었는지 검증
  });

  it('특정 영화 post 버전 전체 조회', async () => {
    const accessToken = '';
    const response = await request(app.getHttpServer())
      .get('/1/record')
      .set('Authorization', `Bearer ${accessToken}`);
  });
});
