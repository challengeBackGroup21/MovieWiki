import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './likes.service';
import { LikesModule } from './likes.module';
import { LikeRepository } from './like.repository';
import { MovieRepository } from '../movies/movie.repository';
import { LikesController } from './likes.controller';
import { DataSource, QueryRunner } from 'typeorm';

describe('LikeService', () => {
  let likeService: LikeService;
  let likeRepository: LikeRepository;
  let movieRepository: MovieRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeService],
    }).compile();

    likeService = module.get<LikeService>(LikeService);
    likeRepository = module.get<LikeRepository>(LikeRepository);
    movieRepository = module.get<MovieRepository>(MovieRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(likeService).toBeDefined();
  });

  it('updateLike success', async () => {
    // given
    const movieId = 1;
    const userId = 1;

    likeService.makeQueryRunner = jest.fn();
    likeService.likeApplyWithRollback = jest.fn();

    // when
    await likeService.updateLike(movieId, userId);

    // then
    expect(likeService.makeQueryRunner).toHaveBeenCalledTimes(1);
    expect(likeService.likeApplyWithRollback).toHaveBeenCalledTimes(1);
  });

  it('makeQueryRunner success', async () => {
    // given
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
    };
    dataSource.createQueryRunner = jest.fn().mockReturnValue(mockQueryRunner);

    // when
    await likeService.makeQueryRunner();

    // then
    expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
    expect(mockQueryRunner.connect).toHaveBeenCalledTimes(1);
    expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
  });

  // interface QueryRunner {
  //   rollbackTransaction: () => Promise<void>;
  //   release: () => Promise<void>;
  //   // 기타 필요한 메서드 및 속성 정의
  // }

  it('likeApplyWithRollback success', async () => {
    // given
    const movieId = 1;
    const userId = 1;
    const mockQueryRunner = {
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    } as unknown as QueryRunner;

    likeService.likeApply = jest
      .fn()
      .mockReturnValue('해당 영화에 좋아요를 등록하였습니다.');

    // when
    await likeService.likeApplyWithRollback(movieId, userId, mockQueryRunner);

    // then
    expect(likeService.likeApply).toHaveBeenCalledTimes(1);
    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(0);
    expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
  });

  it('likeApply success like not exist', async () => {
    // given
    const movieId = 1;
    const userId = 1;
    const mockQueryRunner = {} as unknown as QueryRunner;
    const like = undefined;

    likeRepository.findOneLike = jest.fn().mockReturnValue(like);

    likeService.addLike = jest.fn();
    likeService.removeLike = jest.fn();

    // when
    await likeService.likeApply(movieId, userId, mockQueryRunner);

    // then
    expect(likeRepository.findOneLike).toHaveBeenCalledTimes(1);
    expect(likeService.addLike).toHaveBeenCalledTimes(1);
    expect(likeService.removeLike).toHaveBeenCalledTimes(0);
  });

  it('likeApply success like exist', async () => {
    // given
    const movieId = 1;
    const userId = 1;
    const mockQueryRunner = {} as unknown as QueryRunner;
    const like = {};

    likeRepository.findOneLike = jest.fn().mockReturnValue(like);

    likeService.addLike = jest.fn();
    likeService.removeLike = jest.fn();

    // when
    await likeService.likeApply(movieId, userId, mockQueryRunner);

    // then
    expect(likeRepository.findOneLike).toHaveBeenCalledTimes(1);
    expect(likeService.addLike).toHaveBeenCalledTimes(0);
    expect(likeService.removeLike).toHaveBeenCalledTimes(1);
  });

  it('addLike success', async () => {
    // given
    const movieId = 1;
    const userId = 1;
    const mockQueryRunner = {
      commitTransaction: jest.fn(),
    } as unknown as QueryRunner;

    likeRepository.createLike = jest.fn();
    movieRepository.incrementMovieLike = jest.fn();

    // when
    await likeService.addLike(movieId, userId, mockQueryRunner);

    // then
    expect(likeRepository.createLike).toHaveBeenCalledTimes(1);
    expect(movieRepository.incrementMovieLike).toHaveBeenCalledTimes(1);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
  });

  it('removeLike success', async () => {
    // given
    const movieId = 1;
    const userId = 1;
    const mockQueryRunner = {
      commitTransaction: jest.fn(),
    } as unknown as QueryRunner;

    likeRepository.destroyLike = jest.fn();
    movieRepository.decrementMovieLike = jest.fn();

    // when
    await likeService.removeLike(movieId, userId, mockQueryRunner);

    // then
    expect(likeRepository.destroyLike).toHaveBeenCalledTimes(1);
    expect(movieRepository.decrementMovieLike).toHaveBeenCalledTimes(1);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
  });
});
