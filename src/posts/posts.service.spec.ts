import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './posts.service';
import { PostRepository } from './post.repository';
import { MovieRepository } from '../movies/movie.repository';
import { SnapshotRepository } from '../snapshot/snapshot.repository';
import { CurrentSnapshotRepository } from '../current-snapshot/current-snapshot.repository';
import { DataSource, QueryRunner } from 'typeorm';
import { CreatePostRecordDto } from './dto/create-post-record.dto';

describe('PostsService', () => {
  let postService: PostService;
  let movieRepository: MovieRepository;
  let postRepository: PostRepository;
  let csRepository: CurrentSnapshotRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: {
            getLatestPostRecord: jest.fn(),
            createPostRecord: jest.fn(),
          },
        },
        {
          provide: MovieRepository,
          useValue: { findOneMovie: jest.fn() },
        },
        {
          provide: SnapshotRepository,
          useValue: {},
        },
        {
          provide: CurrentSnapshotRepository,
          useValue: {
            findOneCurrentSnapshot: jest.fn(),
            createCurrentSnapshot: jest.fn(),
            updateCurrentSnapshot: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: { createQueryRunner: jest.fn() },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
    postRepository = module.get<PostRepository>(PostRepository);
    csRepository = module.get<CurrentSnapshotRepository>(
      CurrentSnapshotRepository,
    );
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('createPostRecord success', async () => {
    // given
    const createPostRecordDto: CreatePostRecordDto = {
      content: '',
      comment: 'ㅇㅇ',
      version: null,
    };

    const movieId = 1;
    const user = {
      userId: 1,
      email: '',
      nickname: '',
      auth: 'USER',
    };

    postService.makeQueryRunner = jest.fn();
    postService.createPostWithRollback = jest.fn();

    // when
    await postService.createPostRecord(createPostRecordDto, movieId, user);

    // then
    expect(postService.makeQueryRunner).toHaveBeenCalledTimes(1);
    expect(postService.createPostWithRollback).toHaveBeenCalledTimes(1);
  });

  it('createPostWithRollback success', async () => {
    // given
    const createPostRecordDto: CreatePostRecordDto = {
      content: '',
      comment: 'ㅇㅇ',
      version: null,
    };
    const movieId = 1;
    const user = {
      userId: 1,
      email: '',
      nickname: '',
      auth: 'USER',
    };

    const mockQueryRunner = {
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as unknown as QueryRunner;

    postService.savePostAndSnapshot = jest.fn();

    // when
    await postService.createPostWithRollback(
      createPostRecordDto,
      movieId,
      user,
      mockQueryRunner,
    );

    // then
    expect(postService.savePostAndSnapshot).toHaveBeenCalledTimes(1);
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
    expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
  });

  it('savePostAndSnapshot success', async () => {
    // given
    const createPostRecordDto: CreatePostRecordDto = {
      content: '',
      comment: 'ㅇㅇ',
      version: null,
    };
    const movieId = 1;
    const user = {
      userId: 1,
      email: '',
      nickname: '',
      auth: 'USER',
    };

    const mockQueryRunner = {
      commitTransaction: jest.fn(),
    } as unknown as QueryRunner;

    postService.saveDiffOnPost = jest.fn();
    postService.saveCurrentSnapshot = jest.fn();
    postService.createTenMultipleSnapshot = jest.fn();

    // when
    await postService.savePostAndSnapshot(
      createPostRecordDto,
      movieId,
      user,
      mockQueryRunner,
    );

    // then
    expect(postService.saveDiffOnPost).toHaveBeenCalledTimes(1);
    expect(postService.saveCurrentSnapshot).toHaveBeenCalledTimes(1);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(postService.createTenMultipleSnapshot).toHaveBeenCalledTimes(1);
  });

  it('saveDiffOnPost success', async () => {
    // given
    const createPostRecordDto: CreatePostRecordDto = {
      content: '',
      comment: 'ㅇㅇ',
      version: null,
    };
    const movieId = 1;
    const user = {
      userId: 1,
      email: '',
      nickname: '',
      auth: 'USER',
    };

    const mockQueryRunner = {} as unknown as QueryRunner;

    const movie = {};

    movieRepository.findOneMovie = jest.fn().mockReturnValue(movie);
    postService.checkLatestVersion = jest.fn();
    postService.calcDiff = jest.fn();

    // when
    await postService.saveDiffOnPost(
      createPostRecordDto,
      movieId,
      user,
      mockQueryRunner,
    );

    // then
    expect(movieRepository.findOneMovie).toHaveBeenCalledTimes(1);
    expect(postRepository.getLatestPostRecord).toHaveBeenCalledTimes(1);
    expect(postService.checkLatestVersion).toHaveBeenCalledTimes(1);
    expect(postService.calcDiff).toHaveBeenCalledTimes(1);
    expect(postRepository.createPostRecord).toHaveBeenCalledTimes(1);
  });

  it('saveCurrentSnapshot success currentSnapshot exist', async () => {
    // given
    const createPostRecordDto: CreatePostRecordDto = {
      content: '',
      comment: 'ㅇㅇ',
      version: null,
    };
    const movieId = 1;

    const mockQueryRunner = {} as unknown as QueryRunner;

    const currentSnapshot = {};

    csRepository.findOneCurrentSnapshot = jest
      .fn()
      .mockReturnValue(currentSnapshot);

    // when
    await postService.saveCurrentSnapshot(
      createPostRecordDto,
      movieId,
      mockQueryRunner,
    );

    // then
    expect(csRepository.findOneCurrentSnapshot).toHaveBeenCalledTimes(1);
    expect(csRepository.createCurrentSnapshot).toHaveBeenCalledTimes(0);
    expect(csRepository.updateCurrentSnapshot).toHaveBeenCalledTimes(1);
  });
});
