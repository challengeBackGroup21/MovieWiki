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
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      this.likeApply(movieId, userId, queryRunner);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException('영화 좋아요에 실패하였습니다.', 400);
    } finally {
      await queryRunner.release();
    }
  }

  /** movieId와 userId에 맞게 좋아요 적용 */
  async likeApply(movieId: number, userId: number, queryRunner: QueryRunner) {
    const like = await this.likeRepository.findOneLike(movieId, userId);

    if (!like) {
      await this.likeRepository.createLike(movieId, userId);
      await this.movieRepository.incrementMovieLike(movieId);
      await queryRunner.commitTransaction();
      return '해당 영화에 좋아요를 등록하였습니다.';
    } else {
      await this.likeRepository.destroyLike(movieId, userId);
      await this.movieRepository.decrementMovieLike(movieId);
      await queryRunner.commitTransaction();
      return '해당 영화에 좋아요를 취소하였습니다.';
    }
  }
}
