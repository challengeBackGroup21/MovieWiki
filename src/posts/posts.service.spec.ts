import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './posts.service';
import { PostRepository } from './post.repository';
import { MovieRepository } from '../movies/movie.repository';
import { SnapshotRepository } from '../snapshot/snapshot.repository';
import { CurrentSnapshotRepository } from '../current-snapshot/current-snapshot.repository';
import { DataSource } from 'typeorm';
import { CreatePostRecordDto } from './dto/create-post-record.dto';

describe('PostsService', () => {
  let postService: PostService;

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
          useValue: { createQueryRunner: jest.fn() },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  /** 좀 나눠야 할 것 같기도 하다. */
  // it('createPostRecord success', () => {
  //   // given
  //   const createPostRecordDto: CreatePostRecordDto = {
  //     content: '',
  //     comment: 'ㅇㅇ',
  //     version: null,
  //   };

  //   const movieId = 1;
  //   const user = {
  //     userId: 1,
  //     email: '',
  //     nickname: '',
  //     auth: 'USER',
  //   };

  //   // when
  //   postService.createPostRecord(createPostRecordDto, movieId, user);
  //   // then
  // });
});
