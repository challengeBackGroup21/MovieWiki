import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from './likes.controller';
import { LikeService } from './likes.service';
import { LikeRepository } from './like.repository';
import { MovieRepository } from '../movies/movie.repository';
import { Like } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [LikeService, LikeRepository, MovieRepository],
  exports: [LikeService, LikeRepository],
})
export class LikesModule {}
