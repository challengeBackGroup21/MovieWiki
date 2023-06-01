import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Movie } from '.././movies/movie.entity';

@Injectable()
export class LikeRepository {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>
    ) { }

    async findOneLike(movieId: number, userId: number) {
        return this.likeRepository.findOne({
            where: { movieId, userId }
        });
    }

    async createLike(movieId: number, userId: number) {
        const like = this.likeRepository.create({ movieId, userId });
        return this.likeRepository.save(like);
    }

    async destroyLike(movieId: number, userId: number) {
        await this.likeRepository.delete({ movieId, userId });
    }

    async incrementMovieLike(movieId: number) {
        await this.movieRepository.increment({ movieId }, "likes", 1);
    }

    async decrementMovieLike(movieId: number) {
        await this.movieRepository.decrement({ movieId }, "likes", 1);
    }
};
