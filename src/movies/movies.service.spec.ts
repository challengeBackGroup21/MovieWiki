import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { MoviesService } from './movies.service';
import Redis from 'ioredis';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let movieRepository: MovieRepository;

  // beforeEach(async () => {
  //   const redisConfig = config.get('redis');
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       RedisModule.forRoot({
  //         config: {
  //           host: redisConfig.host,
  //           port: redisConfig.port,
  //           password: redisConfig.password,
  //         },
  //       }),
  //     ],
  //     providers: [
  //       MoviesService,
  //       {
  //         provide: getRepositoryToken(MovieRepository),
  //         useValue: { find: jest.fn(), findOne: jest.fn() },
  //       },
  //       {
  //         provide: Cache,
  //         useValue: {
  //           get: jest.fn(),
  //           set: jest.fn(),
  //         },
  //       },
  //       { provide: Redis, useValue: {} },
  //       { provide: ElasticsearchService, useValue: {} },
  //     ],
  //   }).compile();

  //   moviesService = module.get<MoviesService>(MoviesService);
  //   movieRepository = module.get<MovieRepository>(MovieRepository);
  // });
  describe('moviesService unit test', () => {
    it('should be defined', () => {
      // expect(moviesService).toBeDefined();
    });

    it('should be defined', () => {
      // expect(movieRepository).toBeDefined();
    });

    // describe('getLikedMovieList', () => {
    //   it('getLikedMovieList', async () => {
    //     const param = 1;
    //     const sptFn = jest.spyOn(movieRepository, 'getLikedMovieList');
    //     const result = movie
    //   });
    // });
  });
});
