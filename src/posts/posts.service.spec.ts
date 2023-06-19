import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './posts.service';
import { PostRepository } from './post.repository';
import { MovieRepository } from '../movies/movie.repository';
import { SnapshotRepository } from '../snapshot/snapshot.repository';
import { CurrentSnapshotRepository } from '../current-snapshot/current-snapshot.repository';
import { DataSource } from 'typeorm';

describe('PostsService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: {},
        },
        {
          provide: MovieRepository,
          useValue: {},
        },
        {
          provide: SnapshotRepository,
          useValue: {},
        },
        {
          provide: CurrentSnapshotRepository,
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
