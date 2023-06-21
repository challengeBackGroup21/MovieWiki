import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { MoviesService } from './movies.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let movieRepository: MovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieRepository),
          useValue: { find: jest.fn(), findOne: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
  });
  describe('moviesService unit test', () => {
    it('should be defined', () => {
      expect(moviesService).toBeDefined();
    });

    it('should be defined', () => {
      expect(movieRepository).toBeDefined();
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
