import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './likes.service';
import { LikesModule } from './likes.module';
import { LikeRepository } from './like.repository';
import { MovieRepository } from '../movies/movie.repository';
import { LikesController } from './likes.controller';
import { DataSource } from 'typeorm';

describe('LikeService', () => {
  let service: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        LikesModule,
        LikeService,
        {
          provide: LikeRepository,
          useValue: {
            findOneLike: jest.fn(),
            createLike: jest.fn(),
            destroyLike: jest.fn(),
          },
        },
        {
          provide: MovieRepository,
          useValue: {
            incrementMovieLike: jest.fn(),
            decrementMovieLike: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
