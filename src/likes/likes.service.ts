import { Injectable, HttpException } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { MovieRepository } from '../movies/movie.repository';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly movieRepository: MovieRepository,
    private readonly dataSource: DataSource,
  ) {}

  async updateLike(movieId: number, userId: number): Promise<any> {
    const queryRunner = await this.makeQueryRunner();
    return this.likeApplyWithRollback(movieId, userId, queryRunner);
  }

  /** queryRunner를 만들고 db와 연결하고 transaction을 시작 */
  async makeQueryRunner(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    return queryRunner;
  }

  /** 중간에 query 실패 시 rollback을 하고 성공 시 likeApply 그대로 적용 */
  async likeApplyWithRollback(
    movieId: number,
    userId: number,
    queryRunner: QueryRunner,
  ) {
    try {
      return await this.likeApply(movieId, userId, queryRunner);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('영화 좋아요에 실패하였습니다.', 400);
    } finally {
      await queryRunner.release();
    }
  }

  /** movieId와 userId에 맞게 좋아요 적용 후 텍스트 반환 */
  async likeApply(movieId: number, userId: number, queryRunner: QueryRunner) {
    const like = await this.likeRepository.findOneLike(movieId, userId);

    if (!like) {
      return this.addLike(movieId, userId, queryRunner);
    } else {
      return this.removeLike(movieId, userId, queryRunner);
    }
  }

  /** like 추가, movie에 likes +1 */
  async addLike(movieId: number, userId: number, queryRunner: QueryRunner) {
    await this.likeRepository.createLike(movieId, userId);
    await this.movieRepository.incrementMovieLike(movieId);
    await queryRunner.commitTransaction();
    return '해당 영화에 좋아요를 등록하였습니다.';
  }

  /** like 제거, movie에 likes -1 */
  async removeLike(movieId: number, userId: number, queryRunner: QueryRunner) {
    await this.likeRepository.destroyLike(movieId, userId);
    await this.movieRepository.decrementMovieLike(movieId);
    await queryRunner.commitTransaction();
    return '해당 영화에 좋아요를 취소하였습니다.';
  }
}
