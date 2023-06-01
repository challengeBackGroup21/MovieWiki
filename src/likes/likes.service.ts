import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class LikeService {
    constructor(
        private readonly likeRepository: LikeRepository,
        private readonly dataSource: DataSource
    ) { }

    async updateLike(movieId: number, userId: number): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction("READ COMMITTED");

        try {
            const like = await this.likeRepository.findOneLike(movieId, userId);

            if (!like) {
                await this.likeRepository.createLike(movieId, userId);
                await this.likeRepository.incrementMovieLike(movieId);
                await queryRunner.commitTransaction();
                return '해당 영화에 좋아요를 등록하였습니다.';
            } else {
                await this.likeRepository.destroyLike(movieId, userId);
                await this.likeRepository.decrementMovieLike(movieId);
                await queryRunner.commitTransaction();
                return '해당 영화에 좋아요를 취소하였습니다.';
            }

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new HttpException('영화 좋아요에 실패하였습니다.', 400);
        } finally {
            await queryRunner.release();
        };
    }
}