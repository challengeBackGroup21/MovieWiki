import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async findOneLike(movieId: number, userId: number) {
    return this.likeRepository.findOne({
      where: { movieId, userId },
    });
  }

  async createLike(movieId: number, userId: number) {
    const like = this.likeRepository.create({ movieId, userId });
    return this.likeRepository.save(like);
  }

  async destroyLike(movieId: number, userId: number) {
    await this.likeRepository.delete({ movieId, userId });
  }
}
